/**
 * Synthesised range sounds (WebAudio, no sample files): gunshot, dry fire,
 * reload clicks, hit marker, footsteps, hurt. One shared context, created on
 * first user gesture.
 */
let ctx: AudioContext | null = null;
let noiseBuf: AudioBuffer | null = null;

function ac(): AudioContext | null {
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function noise(c: AudioContext): AudioBuffer {
  if (noiseBuf) return noiseBuf;
  const b = c.createBuffer(1, c.sampleRate * 0.5, c.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  noiseBuf = b;
  return b;
}

function burst(c: AudioContext, opts: { dur: number; gain: number; hp?: number; lp?: number; at?: number }) {
  const src = c.createBufferSource();
  src.buffer = noise(c);
  const g = c.createGain();
  const t0 = c.currentTime + (opts.at ?? 0);
  g.gain.setValueAtTime(opts.gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur);
  let node: AudioNode = src;
  if (opts.hp) { const f = c.createBiquadFilter(); f.type = "highpass"; f.frequency.value = opts.hp; node.connect(f); node = f; }
  if (opts.lp) { const f = c.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = opts.lp; node.connect(f); node = f; }
  node.connect(g).connect(c.destination);
  src.start(t0);
  src.stop(t0 + opts.dur + 0.05);
}

function tone(c: AudioContext, freq: number, dur: number, gain: number, type: OscillatorType = "sine", at = 0, slideTo?: number) {
  const o = c.createOscillator();
  const g = c.createGain();
  const t0 = c.currentTime + at;
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(c.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.02);
}

export const sfx = {
  shot() {
    const c = ac(); if (!c) return;
    burst(c, { dur: 0.16, gain: 0.9, hp: 300 });
    burst(c, { dur: 0.35, gain: 0.5, lp: 900 });
    tone(c, 160, 0.18, 0.7, "triangle", 0, 50);
  },
  /** Suspect fires at the officer — louder low thump, slight delay. */
  enemyShot() {
    const c = ac(); if (!c) return;
    burst(c, { dur: 0.22, gain: 0.7, hp: 200 });
    burst(c, { dur: 0.5, gain: 0.55, lp: 600 });
    tone(c, 120, 0.25, 0.6, "triangle", 0, 40);
  },
  taser() {
    const c = ac(); if (!c) return;
    for (let i = 0; i < 8; i++) tone(c, 1800 + Math.random() * 600, 0.04, 0.25, "square", i * 0.06);
  },
  dry() {
    const c = ac(); if (!c) return;
    tone(c, 900, 0.03, 0.3, "square");
    tone(c, 500, 0.05, 0.2, "square", 0.03);
  },
  reload() {
    const c = ac(); if (!c) return;
    burst(c, { dur: 0.05, gain: 0.35, hp: 1500 });
    burst(c, { dur: 0.06, gain: 0.45, hp: 1200, at: 0.55 });
    tone(c, 300, 0.08, 0.3, "square", 1.35, 120);
  },
  hit() {
    const c = ac(); if (!c) return;
    tone(c, 2200, 0.05, 0.25, "sine");
    tone(c, 1500, 0.05, 0.2, "sine", 0.03);
  },
  step(sprint: boolean) {
    const c = ac(); if (!c) return;
    burst(c, { dur: sprint ? 0.09 : 0.07, gain: sprint ? 0.22 : 0.13, lp: 500 });
  },
  hurt() {
    const c = ac(); if (!c) return;
    tone(c, 220, 0.25, 0.5, "sawtooth", 0, 90);
    burst(c, { dur: 0.25, gain: 0.3, lp: 700 });
  },
  draw() {
    const c = ac(); if (!c) return;
    burst(c, { dur: 0.12, gain: 0.25, hp: 800 });
  },
};
