"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Microphone capture straight to 16 kHz mono PCM WAV, with voice-activity
 * detection. Replaces MediaRecorder → decode → re-encode: the clip is ready
 * the instant the officer stops talking, and with `autoStop` the recording
 * ends by itself after a short silence — no "stop" tap, no dead air.
 */

export interface RecorderOptions {
  /** End automatically after `silenceMs` of silence once speech was heard. */
  autoStop?: boolean;
  silenceMs?: number;
  /** Give up if nothing is said at all within this time. */
  noSpeechMs?: number;
  maxMs?: number;
  /** 0..1 input level, ~20×/s — for a live meter. */
  onLevel?: (level: number) => void;
  /** Fired once when the first speech is detected. */
  onSpeechStart?: () => void;
}

export interface RecordedClip {
  /** base64 WAV (16 kHz mono 16-bit). */
  base64: string;
  mimeType: "audio/wav";
  durationMs: number;
  /** True if VAD heard speech (false → silence/noise only). */
  speech: boolean;
}

export interface ActiveRecording {
  /** Stop now and resolve `done` with the clip. */
  stop: () => void;
  /** Stop and resolve `done` with null (discard). */
  cancel: () => void;
  done: Promise<RecordedClip | null>;
}

const TARGET_RATE = 16000;

let sharedCtx: AudioContext | null = null;
function audioContext(): AudioContext {
  const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
  if (!sharedCtx || sharedCtx.state === "closed") sharedCtx = new AC();
  return sharedCtx!;
}

export function canRecordPcm(): boolean {
  return (
    typeof window !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    !!((window as any).AudioContext || (window as any).webkitAudioContext)
  );
}

function downsample(chunks: Float32Array[], inRate: number): Float32Array {
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const input = new Float32Array(total);
  let off = 0;
  for (const c of chunks) {
    input.set(c, off);
    off += c.length;
  }
  if (inRate === TARGET_RATE) return input;
  const ratio = inRate / TARGET_RATE;
  const out = new Float32Array(Math.floor(total / ratio));
  // Box-filter average per output sample — cheap anti-aliasing for speech.
  for (let i = 0; i < out.length; i++) {
    const start = Math.floor(i * ratio);
    const end = Math.min(total, Math.floor((i + 1) * ratio));
    let sum = 0;
    for (let j = start; j < end; j++) sum += input[j];
    out[i] = end > start ? sum / (end - start) : 0;
  }
  return out;
}

function encodeWav(pcm: Float32Array): Uint8Array {
  const out = new ArrayBuffer(44 + pcm.length * 2);
  const v = new DataView(out);
  const w = (o: number, t: string) => {
    for (let i = 0; i < t.length; i++) v.setUint8(o + i, t.charCodeAt(i));
  };
  w(0, "RIFF");
  v.setUint32(4, 36 + pcm.length * 2, true);
  w(8, "WAVE");
  w(12, "fmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, TARGET_RATE, true);
  v.setUint32(28, TARGET_RATE * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  w(36, "data");
  v.setUint32(40, pcm.length * 2, true);
  let o = 44;
  for (let i = 0; i < pcm.length; i++, o += 2) {
    const x = Math.max(-1, Math.min(1, pcm[i]));
    v.setInt16(o, x < 0 ? x * 0x8000 : x * 0x7fff, true);
  }
  return new Uint8Array(out);
}

export function bytesToBase64(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + 0x8000)));
  }
  return btoa(bin);
}

/** Trim leading/trailing silence (keeps 250 ms padding) — smaller upload, faster model. */
function trimSilence(pcm: Float32Array): Float32Array {
  const win = TARGET_RATE / 50; // 20 ms
  const thr = 0.012;
  const rms = (s: number) => {
    let sum = 0;
    const e = Math.min(pcm.length, s + win);
    for (let i = s; i < e; i++) sum += pcm[i] * pcm[i];
    return Math.sqrt(sum / Math.max(1, e - s));
  };
  let a = 0;
  while (a < pcm.length && rms(a) < thr) a += win;
  let b = pcm.length;
  while (b > a && rms(Math.max(0, b - win)) < thr) b -= win;
  const pad = TARGET_RATE / 4;
  a = Math.max(0, a - pad);
  b = Math.min(pcm.length, b + pad);
  return b - a > TARGET_RATE / 5 ? pcm.subarray(a, b) : pcm;
}

export async function startRecording(opts: RecorderOptions = {}): Promise<ActiveRecording> {
  const { autoStop = false, silenceMs = 1100, noSpeechMs = 8000, maxMs = 30000, onLevel, onSpeechStart } = opts;
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 },
  });
  const ctx = audioContext();
  if (ctx.state === "suspended") await ctx.resume();
  const source = ctx.createMediaStreamSource(stream);
  // ScriptProcessor is deprecated but universally available (Android Chrome
  // included) and needs no separate worklet file.
  const proc = ctx.createScriptProcessor(4096, 1, 1);
  const sink = ctx.createGain();
  sink.gain.value = 0;

  const chunks: Float32Array[] = [];
  const startedAt = performance.now();
  let heardSpeech = false;
  let lastVoiceAt = startedAt;
  // Adaptive noise floor: the first ~300 ms calibrate it.
  let noiseFloor = 0.008;
  let calibrated = 0;
  let finished = false;
  let resolveDone!: (c: RecordedClip | null) => void;
  const done = new Promise<RecordedClip | null>((r) => (resolveDone = r));
  let lastLevelAt = 0;

  const cleanup = () => {
    try {
      proc.disconnect();
      source.disconnect();
      sink.disconnect();
    } catch {}
    stream.getTracks().forEach((t) => t.stop());
  };

  const finish = (keep: boolean) => {
    if (finished) return;
    finished = true;
    cleanup();
    if (!keep || chunks.length === 0) {
      resolveDone(null);
      return;
    }
    const pcm = trimSilence(downsample(chunks, ctx.sampleRate));
    resolveDone({
      base64: bytesToBase64(encodeWav(pcm)),
      mimeType: "audio/wav",
      durationMs: Math.round((pcm.length / TARGET_RATE) * 1000),
      speech: heardSpeech,
    });
  };

  proc.onaudioprocess = (e) => {
    if (finished) return;
    const data = e.inputBuffer.getChannelData(0);
    chunks.push(new Float32Array(data));
    let sum = 0;
    for (let i = 0; i < data.length; i++) sum += data[i] * data[i];
    const rms = Math.sqrt(sum / data.length);
    const now = performance.now();

    if (calibrated < 3) {
      noiseFloor = Math.max(0.004, Math.min(0.03, (noiseFloor * calibrated + rms) / (calibrated + 1)));
      calibrated++;
    }
    const threshold = Math.max(0.015, noiseFloor * 2.6);
    if (rms > threshold) {
      if (!heardSpeech) {
        heardSpeech = true;
        onSpeechStart?.();
      }
      lastVoiceAt = now;
    }
    if (onLevel && now - lastLevelAt > 50) {
      lastLevelAt = now;
      onLevel(Math.min(1, rms / 0.12));
    }

    const elapsed = now - startedAt;
    if (elapsed >= maxMs) finish(true);
    else if (autoStop && heardSpeech && now - lastVoiceAt >= silenceMs) finish(true);
    else if (autoStop && !heardSpeech && elapsed >= noSpeechMs) finish(true);
  };

  source.connect(proc);
  proc.connect(sink);
  sink.connect(ctx.destination);

  return {
    stop: () => finish(true),
    cancel: () => finish(false),
    done,
  };
}
