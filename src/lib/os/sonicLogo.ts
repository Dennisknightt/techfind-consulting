/**
 * Techfind "sonic logo" — a bright bell-like "ding" struck three times in
 * quick succession (the 2020+ BMW comfort-access/start chime pattern),
 * synthesized in the browser via the Web Audio API so V1 doesn't depend
 * on a shipped audio asset. A real bell strike is inharmonic (its
 * overtones aren't clean integer multiples of the fundamental) — that's
 * what makes it read as "ding" rather than a plain synth blip — so each
 * strike layers a few inharmonic partials rather than a single tone.
 * Swap `playSonicLogo` for a mastered audio asset later if wanted;
 * callers only depend on the promise-based signature.
 *
 * Autoplay note: browsers only let an AudioContext actually run if it's
 * created/resumed synchronously inside a trusted user-gesture call stack
 * (a click/submit handler) — one created later inside a useEffect after a
 * redirect (e.g. WelcomeExperience mounting on /app right after login)
 * is born suspended and stays that way, silently, no matter how the tone
 * itself is synthesized. `primeSonicLogo()` unlocks a shared context
 * *during* the login click, before the redirect; `playSonicLogo()` then
 * reuses that already-running context on the next page instead of
 * creating a fresh (still-suspended) one. Next.js App Router keeps the
 * same JS realm across that redirect (client-side transition, not a hard
 * reload), so the module-level context survives it.
 */

const STRIKE_COUNT = 3;
const STRIKE_GAP = 0.38; // seconds between the start of each ding

// Bell partials: (frequency ratio, relative level, decay time). Slightly
// inharmonic ratios + a fast-decaying high partial give the metallic
// "shimmer" on the attack that a pure sine lacks.
const PARTIALS: Array<{ ratio: number; level: number; dur: number }> = [
  { ratio: 1,    level: 1.00, dur: 0.42 },
  { ratio: 2.76, level: 0.45, dur: 0.30 },
  { ratio: 5.40, level: 0.18, dur: 0.18 },
];

let sharedCtx: AudioContext | null = null;

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
}

function strikeBell(ctx: AudioContext, master: GainNode, at: number, fundamental: number) {
  PARTIALS.forEach(({ ratio, level, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = fundamental * ratio;
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(level, at + 0.006); // near-instant strike attack
    gain.gain.exponentialRampToValueAtTime(0.001, at + dur);
    osc.connect(gain);
    gain.connect(master);
    osc.start(at);
    osc.stop(at + dur + 0.05);
  });
}

async function ring(ctx: AudioContext, volume: number): Promise<void> {
  const master = ctx.createGain();
  master.gain.value = Math.max(0, Math.min(1, volume)) * 0.5;
  master.connect(ctx.destination);

  const now = ctx.currentTime;
  const fundamental = 880; // A5 — the classic bright "ding" pitch

  for (let i = 0; i < STRIKE_COUNT; i++) {
    strikeBell(ctx, master, now + i * STRIKE_GAP, fundamental);
  }

  const totalMs = (STRIKE_GAP * (STRIKE_COUNT - 1) + PARTIALS[0].dur + 0.1) * 1000;
  await new Promise(resolve => setTimeout(resolve, totalMs));
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
