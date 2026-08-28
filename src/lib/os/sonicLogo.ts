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

export async function playSonicLogo(volume = 0.6): Promise<void> {
  if (typeof window === "undefined") return;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
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
  } finally {
    ctx.close().catch(() => {});
  }
}
