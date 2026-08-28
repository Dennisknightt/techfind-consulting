/**
 * Techfind "sonic logo" — a single bright bell-like "ding" (the classic
 * car-startup/seatbelt-chime style cue), synthesized in the browser via
 * the Web Audio API so V1 doesn't depend on a shipped audio asset. A real
 * bell strike is inharmonic (its overtones aren't clean integer multiples
 * of the fundamental) — that's what makes it read as "ding" rather than
 * a plain synth blip — so this layers a few inharmonic partials rather
 * than a single tone. Swap `playSonicLogo` for a mastered audio asset
 * later if wanted; callers only depend on the promise-based signature.
 */
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

    // Bell partials: (frequency ratio, relative level, decay time). Slightly
    // inharmonic ratios + a fast-decaying high partial give the metallic
    // "shimmer" on the attack that a pure sine lacks.
    const partials: Array<{ ratio: number; level: number; dur: number }> = [
      { ratio: 1,    level: 1.00, dur: 1.10 },
      { ratio: 2.76, level: 0.45, dur: 0.70 },
      { ratio: 5.40, level: 0.18, dur: 0.35 },
    ];

    partials.forEach(({ ratio, level, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = fundamental * ratio;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(level, now + 0.006); // near-instant strike attack
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + dur + 0.05);
    });

    await new Promise(resolve => setTimeout(resolve, 900));
  } finally {
    ctx.close().catch(() => {});
  }
}
