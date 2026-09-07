/**
 * Techfind "sonic logo" — a short mastered whoosh (public/sounds/startup.mp3)
 * played once per session when you first sign in. Uses the Web Audio API
 * (decode once into a cached AudioBuffer, then play via a BufferSource)
 * rather than a plain <audio> element so it can share the same autoplay
 * unlock trick a synthesized tone would need anyway.
 *
 * Autoplay note: browsers only let an AudioContext actually run if it's
 * created/resumed synchronously inside a trusted user-gesture call stack
 * (a click/submit handler) — one created later inside a useEffect after a
 * redirect (e.g. WelcomeExperience mounting on /app right after login)
 * is born suspended and stays that way, silently. `primeSonicLogo()`
 * unlocks a shared context *during* the login click, before the redirect;
 * `playSonicLogo()` then reuses that already-running context on the next
 * page instead of creating a fresh (still-suspended) one. Next.js App
 * Router keeps the same JS realm across that redirect (client-side
 * transition, not a hard reload), so the module-level context survives it.
 */

const SOUND_URL = "/sounds/startup.mp3";

let sharedCtx: AudioContext | null = null;
let bufferPromise: Promise<AudioBuffer> | null = null;

function getCtor(): typeof AudioContext | undefined {
  if (typeof window === "undefined") return undefined;
  return window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
}

/**
 * Call synchronously from inside a real user-gesture handler (a click or
 * form submit) — e.g. the login form's onSubmit — well before any
 * redirect. Safe to call more than once; a no-op after the first unlock.
 */
export function primeSonicLogo(): void {
  const Ctor = getCtor();
  if (!Ctor || sharedCtx) return;
  sharedCtx = new Ctor();
  sharedCtx.resume().catch(() => {});
  void loadBuffer(sharedCtx); // kick off the fetch/decode early so it's ready by the time it's needed
}

/** Fetched and decoded once, then reused for every play — decodeAudioData needs a context to decode into, but the resulting buffer is playable through any context. */
function loadBuffer(ctx: AudioContext): Promise<AudioBuffer> {
  if (!bufferPromise) {
    bufferPromise = fetch(SOUND_URL)
      .then(res => res.arrayBuffer())
      .then(data => ctx.decodeAudioData(data));
  }
  return bufferPromise;
}

async function ring(ctx: AudioContext, volume: number): Promise<void> {
  const buffer = await loadBuffer(ctx);
  const source = ctx.createBufferSource();
  const gain = ctx.createGain();
  source.buffer = buffer;
  gain.gain.value = Math.max(0, Math.min(1, volume));
  source.connect(gain);
  gain.connect(ctx.destination);

  await new Promise<void>(resolve => {
    source.onended = () => resolve();
    source.start();
  });
}

export async function playSonicLogo(volume = 0.6): Promise<void> {
  // Prefer the context unlocked during the preceding login click, if any.
  if (sharedCtx) {
    if (sharedCtx.state === "suspended") await sharedCtx.resume().catch(() => {});
    if (sharedCtx.state === "running") {
      await ring(sharedCtx, volume);
      return;
    }
    // Unusable (e.g. closed) — fall through and try a fresh one below.
    sharedCtx = null;
  }

  const Ctor = getCtor();
  if (!Ctor) return;

  const ctx = new Ctor();
  try {
    if (ctx.state === "suspended") {
      await ctx.resume().catch(() => {});
    }
    if (ctx.state !== "running") {
      // Autoplay blocked — respect the platform, fail silently.
      await ctx.close().catch(() => {});
      return;
    }
    await ring(ctx, volume);
  } finally {
    ctx.close().catch(() => {});
  }
}
