/**
 * Temporary Techfind "sonic logo" — a short, premium two-note chime
 * synthesized in the browser via the Web Audio API so V1 doesn't depend
 * on a shipped audio asset. Swap `playSonicLogo` for a real mastered
 * sting (an <audio> element or decoded buffer) once one exists; callers
 * only depend on the promise-based signature below.
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
    master.gain.value = Math.max(0, Math.min(1, volume)) * 0.35;
    master.connect(ctx.destination);

    const now = ctx.currentTime;
    // A calm rising fifth (C5 -> G5) with a soft pad underneath — reads as
    // "premium fintech chime" rather than a notification blip.
    const notes: Array<{ freq: number; start: number; dur: number; type: OscillatorType }> = [
      { freq: 523.25, start: 0.00, dur: 0.55, type: "sine" },
      { freq: 783.99, start: 0.12, dur: 0.70, type: "sine" },
      { freq: 1046.5, start: 0.12, dur: 0.55, type: "triangle" },
    ];

    notes.forEach(({ freq, start, dur, type }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + start);
      gain.gain.linearRampToValueAtTime(1, now + start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);
      osc.connect(gain);
      gain.connect(master);
      osc.start(now + start);
      osc.stop(now + start + dur + 0.05);
    });

    await new Promise(resolve => setTimeout(resolve, 900));
  } finally {
    ctx.close().catch(() => {});
  }
}
