/**
 * TIR external input adapter: laser pistols / trigger boxes / gamepads → app
 * actions. Sources:
 *  - Gamepad API (Xbox/PS pads, most "USB trigger" boxes that enumerate as a
 *    joystick): polled every frame, edge-triggered buttons;
 *  - WebHID (raw trigger devices, e.g. laser pistols on a USB HID bridge): the
 *    user picks the device once, we watch input reports and fire on the bound
 *    byte/bit;
 *  - keyboard/mouse-emulating pistols need nothing (they already click).
 *
 * Every mapped press dispatches `window` event `h360:input` with
 * `{ action, source }`. Bindings persist in localStorage (this module is the
 * storage boundary; components never touch localStorage directly).
 */

export const TIR_INPUT_EVENT = "h360:input";

export const INPUT_ACTIONS = ["fire", "reload", "draw", "holster", "taser", "backup", "cover", "retreat", "pause"] as const;
export type InputAction = (typeof INPUT_ACTIONS)[number];

export type InputSource = "gamepad" | "hid";

export type InputEventDetail = { action: InputAction; source: InputSource; device: string };

/** One physical control: gamepad button index, or a HID (report byte, bit) pair. */
export type ControlRef =
  | { kind: "gamepad"; button: number }
  | { kind: "hid"; byte: number; bit: number };

export type InputBindings = {
  version: 1;
  /** action → control */
  map: Partial<Record<InputAction, ControlRef>>;
  /** vendorId/productId of the HID device the user picked (re-attached via `getDevices()` on next visit). */
  hid?: { vendorId: number; productId: number; name: string } | null;
};

const KEY = "h360:tir:input:v1";

/** Sensible default: Xbox layout (RT/RB = fire, X = reload, Y = draw/holster, B = taser, LB = backup, A = cover, Start = pause). */
export const DEFAULT_BINDINGS: InputBindings = {
  version: 1,
  map: {
    fire: { kind: "gamepad", button: 7 },
    reload: { kind: "gamepad", button: 2 },
    draw: { kind: "gamepad", button: 3 },
    taser: { kind: "gamepad", button: 1 },
    backup: { kind: "gamepad", button: 4 },
    cover: { kind: "gamepad", button: 0 },
    pause: { kind: "gamepad", button: 9 },
  },
  hid: null,
};

export function loadBindings(): InputBindings {
  if (typeof window === "undefined") return DEFAULT_BINDINGS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_BINDINGS;
    const parsed = JSON.parse(raw) as InputBindings;
    return parsed && parsed.version === 1 && parsed.map ? parsed : DEFAULT_BINDINGS;
  } catch {
    return DEFAULT_BINDINGS;
  }
}

export function saveBindings(b: InputBindings): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(b));
  } catch {}
}

export function describeControl(c: ControlRef | undefined): string {
  if (!c) return "—";
  return c.kind === "gamepad" ? `GP B${c.button}` : `HID ${c.byte}:${c.bit}`;
}

/* ---------- hub ---------- */

type HidDeviceLike = {
  vendorId: number;
  productId: number;
  productName: string;
  opened: boolean;
  open(): Promise<void>;
  close(): Promise<void>;
  addEventListener(type: "inputreport", cb: (e: { data: DataView; reportId: number }) => void): void;
  removeEventListener(type: "inputreport", cb: (e: { data: DataView; reportId: number }) => void): void;
};
type HidApi = {
  requestDevice(o: { filters: unknown[] }): Promise<HidDeviceLike[]>;
  getDevices(): Promise<HidDeviceLike[]>;
};
const hidApi = (): HidApi | null => (typeof navigator !== "undefined" && "hid" in navigator ? ((navigator as unknown as { hid: HidApi }).hid ?? null) : null);

export const hidSupported = () => hidApi() !== null;
export const gamepadSupported = () => typeof navigator !== "undefined" && "getGamepads" in navigator;

export type HubStatus = {
  gamepad: string | null;
  hid: string | null;
  /** last raw control seen (for the "press a button" binding capture) */
  lastControl: ControlRef | null;
};

type Listener = (s: HubStatus) => void;

/**
 * Singleton runtime. `start()` on the TIR page, `stop()` on unmount. Cheap when
 * no device is present (one `getGamepads()` per frame).
 */
class InputHub {
  private bindings: InputBindings = DEFAULT_BINDINGS;
  private raf = 0;
  private running = false;
  private padButtons: boolean[] = [];
  private padId: string | null = null;
  private hidDevice: HidDeviceLike | null = null;
  private hidPrev: Uint8Array | null = null;
  private listeners = new Set<Listener>();
  private capture: ((c: ControlRef) => void) | null = null;
  private status: HubStatus = { gamepad: null, hid: null, lastControl: null };

  start(): void {
    if (this.running || typeof window === "undefined") return;
    this.running = true;
    this.bindings = loadBindings();
    this.loop();
    void this.reattachHid();
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
    void this.detachHid();
  }

  getBindings(): InputBindings {
    return this.bindings;
  }

  setBindings(b: InputBindings): void {
    this.bindings = b;
    saveBindings(b);
  }

  bind(action: InputAction, control: ControlRef | null): void {
    const map = { ...this.bindings.map };
    if (control) map[action] = control;
    else delete map[action];
    this.setBindings({ ...this.bindings, map });
  }

  /** Next raw press (gamepad button or HID bit) is handed to `cb`; resolves null on cancel. */
  captureNext(): { promise: Promise<ControlRef | null>; cancel: () => void } {
    let resolve!: (c: ControlRef | null) => void;
    const promise = new Promise<ControlRef | null>((r) => (resolve = r));
    this.capture = (c) => {
      this.capture = null;
      resolve(c);
    };
    return { promise, cancel: () => { this.capture = null; resolve(null); } };
  }

  subscribe(l: Listener): () => void {
    this.listeners.add(l);
    l(this.status);
    return () => this.listeners.delete(l);
  }

  getStatus(): HubStatus {
    return this.status;
  }

  /* ----- gamepad ----- */

  private loop = () => {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this.loop);
    if (!gamepadSupported()) return;
    const pads = navigator.getGamepads?.() ?? [];
    const pad = Array.from(pads).find((p): p is Gamepad => !!p && p.connected);
    if (!pad) {
      if (this.padId) { this.padId = null; this.padButtons = []; this.emitStatus({ gamepad: null }); }
      return;
    }
    if (pad.id !== this.padId) { this.padId = pad.id; this.padButtons = []; this.emitStatus({ gamepad: pad.id }); }
    for (let i = 0; i < pad.buttons.length; i++) {
      const down = pad.buttons[i].pressed || pad.buttons[i].value > 0.5;
      if (down && !this.padButtons[i]) this.onControl({ kind: "gamepad", button: i }, "gamepad", pad.id);
      this.padButtons[i] = down;
    }
  };

  /* ----- WebHID ----- */

  private async reattachHid() {
    const api = hidApi();
    const want = this.bindings.hid;
    if (!api || !want) return;
    try {
      const devs = await api.getDevices();
      const d = devs.find((x) => x.vendorId === want.vendorId && x.productId === want.productId);
      if (d) await this.attachHid(d);
    } catch (e) {
      console.warn("[tir/input] hid reattach failed", e);
    }
  }

  /** User gesture required (button click). */
  async pickHidDevice(): Promise<string | null> {
    const api = hidApi();
    if (!api) return null;
    const [d] = await api.requestDevice({ filters: [] });
    if (!d) return null;
    await this.attachHid(d);
    this.setBindings({ ...this.bindings, hid: { vendorId: d.vendorId, productId: d.productId, name: d.productName } });
    return d.productName;
  }

  async forgetHidDevice(): Promise<void> {
    await this.detachHid();
    this.setBindings({ ...this.bindings, hid: null });
  }

  private onHidReport = (e: { data: DataView; reportId: number }) => {
    const cur = new Uint8Array(e.data.buffer, e.data.byteOffset, e.data.byteLength);
    const prev = this.hidPrev;
    if (prev && prev.length === cur.length) {
      for (let b = 0; b < cur.length; b++) {
        const rising = cur[b] & ~prev[b];
        if (!rising) continue;
        for (let bit = 0; bit < 8; bit++) if (rising & (1 << bit)) this.onControl({ kind: "hid", byte: b, bit }, "hid", this.hidDevice?.productName ?? "hid");
      }
    }
    this.hidPrev = new Uint8Array(cur);
  };

  private async attachHid(d: HidDeviceLike) {
    await this.detachHid();
    if (!d.opened) await d.open();
    d.addEventListener("inputreport", this.onHidReport);
    this.hidDevice = d;
    this.hidPrev = null;
    this.emitStatus({ hid: d.productName });
  }

  private async detachHid() {
    const d = this.hidDevice;
    if (!d) return;
    this.hidDevice = null;
    d.removeEventListener("inputreport", this.onHidReport);
    try { if (d.opened) await d.close(); } catch {}
    this.emitStatus({ hid: null });
  }

  /* ----- dispatch ----- */

  private onControl(c: ControlRef, source: InputSource, device: string) {
    this.emitStatus({ lastControl: c });
    if (this.capture) { this.capture(c); return; }
    for (const a of INPUT_ACTIONS) {
      const b = this.bindings.map[a];
      if (b && sameControl(b, c)) {
        window.dispatchEvent(new CustomEvent<InputEventDetail>(TIR_INPUT_EVENT, { detail: { action: a, source, device } }));
      }
    }
  }

  private emitStatus(patch: Partial<HubStatus>) {
    this.status = { ...this.status, ...patch };
    this.listeners.forEach((l) => l(this.status));
  }
}

export function sameControl(a: ControlRef, b: ControlRef): boolean {
  if (a.kind !== b.kind) return false;
  return a.kind === "gamepad" ? a.button === (b as { button: number }).button : a.byte === (b as { byte: number }).byte && a.bit === (b as { bit: number }).bit;
}

export const inputHub = new InputHub();

/** Subscribe to mapped actions. */
export function onTirInput(cb: (d: InputEventDetail) => void): () => void {
  const h = (e: Event) => cb((e as CustomEvent<InputEventDetail>).detail);
  window.addEventListener(TIR_INPUT_EVENT, h);
  return () => window.removeEventListener(TIR_INPUT_EVENT, h);
}
