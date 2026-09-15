/**
 * TIR shock-belt output adapter. The engine raises `h360:shock` (see
 * TirClient) whenever the officer takes a hit; this module forwards it to real
 * hardware over Web Serial (USB / RS-232 belt controllers, Arduino bridges) or
 * Web Bluetooth (BLE belts), with a configurable payload. Without a device it
 * is a no-op — the on-screen vignette/vibration stand-in stays.
 *
 * Storage boundary for `h360:tir:shock:v1` (components never touch localStorage).
 */

export const SHOCK_EVENT = "h360:shock";

export type ShockTransport = "serial" | "ble";

export type ShockConfig = {
  version: 1;
  enabled: boolean;
  transport: ShockTransport;
  /** stimulus length ms (1–2000), clamped by the belt itself */
  durationMs: number;
  /** 1–100, meaning is device-specific */
  intensity: number;
  /** payload template; `{ms}` `{level}` are substituted; `\n` allowed. Hex mode: "hex:FF 01 {ms16}" */
  template: string;
  serial: { baudRate: number };
  ble: { service: string; characteristic: string; name?: string };
};

const KEY = "h360:tir:shock:v1";

export const DEFAULT_SHOCK: ShockConfig = {
  version: 1,
  enabled: false,
  transport: "serial",
  durationMs: 300,
  intensity: 40,
  template: "SHOCK {ms} {level}\n",
  serial: { baudRate: 115200 },
  ble: { service: "0000ffe0-0000-1000-8000-00805f9b34fb", characteristic: "0000ffe1-0000-1000-8000-00805f9b34fb" },
};

export function loadShockConfig(): ShockConfig {
  if (typeof window === "undefined") return DEFAULT_SHOCK;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SHOCK;
    const p = JSON.parse(raw) as Partial<ShockConfig>;
    return p && p.version === 1 ? { ...DEFAULT_SHOCK, ...p, serial: { ...DEFAULT_SHOCK.serial, ...p.serial }, ble: { ...DEFAULT_SHOCK.ble, ...p.ble } } : DEFAULT_SHOCK;
  } catch {
    return DEFAULT_SHOCK;
  }
}

export function saveShockConfig(c: ShockConfig): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(c));
  } catch {}
}

/** Build the bytes for one stimulus from the template. */
export function encodePayload(c: ShockConfig): Uint8Array<ArrayBuffer> {
  const ms = Math.max(1, Math.min(2000, Math.round(c.durationMs)));
  const level = Math.max(1, Math.min(100, Math.round(c.intensity)));
  const tpl = c.template;
  if (tpl.startsWith("hex:")) {
    const body = tpl
      .slice(4)
      .replace(/\{ms16\}/g, ms.toString(16).padStart(4, "0"))
      .replace(/\{ms\}/g, (ms & 0xff).toString(16).padStart(2, "0"))
      .replace(/\{level\}/g, level.toString(16).padStart(2, "0"));
    const hex = body.replace(/[^0-9a-fA-F]/g, "");
    const out = new Uint8Array(new ArrayBuffer(Math.floor(hex.length / 2)));
    for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    return out;
  }
  const text = tpl.replace(/\{ms\}/g, String(ms)).replace(/\{level\}/g, String(level)).replace(/\\n/g, "\n").replace(/\\r/g, "\r");
  const enc = new TextEncoder().encode(text);
  const out = new Uint8Array(new ArrayBuffer(enc.length));
  out.set(enc);
  return out;
}

/* ---------- minimal Web Serial / Web Bluetooth typings ---------- */

type SerialPortLike = {
  open(o: { baudRate: number }): Promise<void>;
  close(): Promise<void>;
  writable: WritableStream<Uint8Array> | null;
  getInfo(): { usbVendorId?: number; usbProductId?: number };
};
type SerialApi = { requestPort(): Promise<SerialPortLike>; getPorts(): Promise<SerialPortLike[]> };
type BleCharLike = { writeValueWithoutResponse?(v: BufferSource): Promise<void>; writeValue(v: BufferSource): Promise<void> };
type BleDeviceLike = {
  name?: string;
  gatt?: { connected: boolean; connect(): Promise<{ getPrimaryService(s: string): Promise<{ getCharacteristic(c: string): Promise<BleCharLike> }> }>; disconnect(): void };
  addEventListener(t: "gattserverdisconnected", cb: () => void): void;
};
type BleApi = { requestDevice(o: { filters?: unknown[]; acceptAllDevices?: boolean; optionalServices?: string[] }): Promise<BleDeviceLike> };

const serialApi = (): SerialApi | null => (typeof navigator !== "undefined" && "serial" in navigator ? (navigator as unknown as { serial: SerialApi }).serial : null);
const bleApi = (): BleApi | null => (typeof navigator !== "undefined" && "bluetooth" in navigator ? (navigator as unknown as { bluetooth: BleApi }).bluetooth : null);
export const serialSupported = () => serialApi() !== null;
export const bleSupported = () => bleApi() !== null;

export type ShockStatus = {
  connected: boolean;
  device: string | null;
  lastSentAt: number | null;
  lastError: string | null;
  /** how many stimuli were sent this page life (test button + real hits) */
  sent: number;
};

type Listener = (s: ShockStatus) => void;

class ShockHub {
  private config: ShockConfig = DEFAULT_SHOCK;
  private status: ShockStatus = { connected: false, device: null, lastSentAt: null, lastError: null, sent: 0 };
  private listeners = new Set<Listener>();
  private port: SerialPortLike | null = null;
  private ble: { device: BleDeviceLike; char: BleCharLike } | null = null;
  private running = false;
  private onShock = () => void this.fire("hit");

  start(): void {
    if (this.running || typeof window === "undefined") return;
    this.running = true;
    this.config = loadShockConfig();
    window.addEventListener(SHOCK_EVENT, this.onShock);
    if (this.config.enabled && this.config.transport === "serial") void this.reattachSerial();
  }

  stop(): void {
    if (!this.running) return;
    this.running = false;
    window.removeEventListener(SHOCK_EVENT, this.onShock);
    void this.disconnect();
  }

  getConfig(): ShockConfig {
    return this.config;
  }
  setConfig(c: ShockConfig): void {
    this.config = c;
    saveShockConfig(c);
  }
  getStatus(): ShockStatus {
    return this.status;
  }
  subscribe(l: Listener): () => void {
    this.listeners.add(l);
    l(this.status);
    return () => this.listeners.delete(l);
  }

  /* ----- serial ----- */

  private async reattachSerial() {
    const api = serialApi();
    if (!api) return;
    try {
      const [p] = await api.getPorts();
      if (p) await this.openSerial(p);
    } catch (e) {
      this.emit({ lastError: String((e as Error)?.message ?? e) });
    }
  }

  /** User gesture required. */
  async connectSerial(): Promise<void> {
    const api = serialApi();
    if (!api) throw new Error("Web Serial unsupported");
    const p = await api.requestPort();
    await this.openSerial(p);
  }

  private async openSerial(p: SerialPortLike) {
    await this.disconnect();
    await p.open({ baudRate: this.config.serial.baudRate });
    this.port = p;
    const info = p.getInfo();
    const name = info.usbVendorId ? `USB ${info.usbVendorId.toString(16)}:${(info.usbProductId ?? 0).toString(16)}` : "Serial";
    this.emit({ connected: true, device: name, lastError: null });
  }

  /* ----- BLE ----- */

  /** User gesture required. */
  async connectBle(): Promise<void> {
    const api = bleApi();
    if (!api) throw new Error("Web Bluetooth unsupported");
    const { service, characteristic } = this.config.ble;
    const device = await api.requestDevice({ filters: [{ services: [service] }], optionalServices: [service] });
    const server = await device.gatt!.connect();
    const svc = await server.getPrimaryService(service);
    const char = await svc.getCharacteristic(characteristic);
    await this.disconnect();
    this.ble = { device, char };
    device.addEventListener("gattserverdisconnected", () => {
      if (this.ble?.device === device) { this.ble = null; this.emit({ connected: false, device: null }); }
    });
    this.emit({ connected: true, device: device.name ?? "BLE", lastError: null });
  }

  async disconnect(): Promise<void> {
    const p = this.port;
    this.port = null;
    if (p) { try { await p.close(); } catch {} }
    const b = this.ble;
    this.ble = null;
    if (b?.device.gatt?.connected) { try { b.device.gatt.disconnect(); } catch {} }
    if (p || b) this.emit({ connected: false, device: null });
  }

  /* ----- output ----- */

  /** Send one stimulus. `reason` = "hit" (engine) | "test" (panel button). Returns false when nothing was sent. */
  async fire(reason: "hit" | "test"): Promise<boolean> {
    if (reason === "hit" && !this.config.enabled) return false;
    const bytes = encodePayload(this.config);
    try {
      if (this.port?.writable) {
        const w = this.port.writable.getWriter();
        try { await w.write(bytes); } finally { w.releaseLock(); }
      } else if (this.ble) {
        if (this.ble.char.writeValueWithoutResponse) await this.ble.char.writeValueWithoutResponse(bytes);
        else await this.ble.char.writeValue(bytes);
      } else {
        return false;
      }
      this.emit({ lastSentAt: Date.now(), sent: this.status.sent + 1, lastError: null });
      window.dispatchEvent(new CustomEvent("h360:shock-sent", { detail: { reason, bytes: Array.from(bytes) } }));
      return true;
    } catch (e) {
      this.emit({ lastError: String((e as Error)?.message ?? e) });
      return false;
    }
  }

  private emit(patch: Partial<ShockStatus>) {
    this.status = { ...this.status, ...patch };
    this.listeners.forEach((l) => l(this.status));
  }
}

export const shockHub = new ShockHub();
