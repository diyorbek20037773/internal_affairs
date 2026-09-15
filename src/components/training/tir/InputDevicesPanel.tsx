"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Gamepad2, Usb, Crosshair, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DEFAULT_BINDINGS,
  INPUT_ACTIONS,
  describeControl,
  gamepadSupported,
  hidSupported,
  inputHub,
  type HubStatus,
  type InputAction,
  type InputBindings,
} from "@/lib/tir/input";

/** Laser pistol / gamepad binding UI for the TIR range (see docs/tir-input-devices.md). */
export function InputDevicesPanel({ onClose }: { onClose: () => void }) {
  const t = useTranslations("sim.tir.input");
  const [status, setStatus] = useState<HubStatus>(inputHub.getStatus());
  const [bindings, setBindings] = useState<InputBindings>(inputHub.getBindings());
  const [capturing, setCapturing] = useState<InputAction | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => inputHub.subscribe(setStatus), []);

  const capture = (action: InputAction) => {
    setCapturing(action);
    const { promise } = inputHub.captureNext();
    void promise.then((c) => {
      if (c) inputHub.bind(action, c);
      setBindings(inputHub.getBindings());
      setCapturing(null);
    });
  };

  const clear = (action: InputAction) => {
    inputHub.bind(action, null);
    setBindings(inputHub.getBindings());
  };

  const pickHid = async () => {
    setError(null);
    try {
      const name = await inputHub.pickHidDevice();
      if (!name) setError(t("hidCancelled"));
      setBindings(inputHub.getBindings());
    } catch (e) {
      setError(String((e as Error)?.message ?? e));
    }
  };

  const reset = () => {
    inputHub.setBindings(DEFAULT_BINDINGS);
    setBindings(DEFAULT_BINDINGS);
  };

  return (
    <Card className="space-y-3 p-3" data-testid="input-devices">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Crosshair className="h-3.5 w-3.5 text-accent" /> {t("title")}
        </span>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onClose} aria-label={t("close")}><X className="h-4 w-4" /></Button>
      </div>
      <p className="text-[11px] leading-relaxed text-muted-foreground">{t("intro")}</p>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border p-2 text-xs">
          <div className="flex items-center gap-2 font-medium"><Gamepad2 className="h-4 w-4" /> {t("gamepad")}</div>
          <p className="mt-1 text-muted-foreground" data-testid="gamepad-status">
            {!gamepadSupported() ? t("unsupported") : status.gamepad ? status.gamepad : t("gamepadNone")}
          </p>
        </div>
        <div className="rounded-lg border p-2 text-xs">
          <div className="flex items-center gap-2 font-medium"><Usb className="h-4 w-4" /> {t("hid")}</div>
          <p className="mt-1 text-muted-foreground" data-testid="hid-status">
            {!hidSupported() ? t("unsupported") : status.hid ? status.hid : bindings.hid ? `${bindings.hid.name} · ${t("hidDetached")}` : t("hidNone")}
          </p>
          {hidSupported() && (
            <div className="mt-2 flex gap-1.5">
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => void pickHid()}>{t("hidPick")}</Button>
              {bindings.hid && <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => void inputHub.forgetHidDevice().then(() => setBindings(inputHub.getBindings()))}>{t("hidForget")}</Button>}
            </div>
          )}
        </div>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
        {INPUT_ACTIONS.map((a) => (
          <div key={a} className="flex items-center justify-between gap-2 rounded-md border px-2 py-1 text-xs" data-testid={`bind-${a}`}>
            <span className="font-medium">{t(`action.${a}`)}</span>
            <span className="flex items-center gap-1">
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">{describeControl(bindings.map[a])}</code>
              <Button size="sm" variant={capturing === a ? "accent" : "outline"} className="h-6 px-1.5 text-[10px]" onClick={() => capture(a)} disabled={capturing !== null && capturing !== a}>
                {capturing === a ? t("press") : t("bind")}
              </Button>
              {bindings.map[a] && <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => clear(a)} aria-label={t("clear")}><X className="h-3 w-3" /></Button>}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span data-testid="last-control">{t("last")}: <code className="font-mono">{describeControl(status.lastControl ?? undefined)}</code></span>
        <Button size="sm" variant="ghost" className="h-6 text-[11px]" onClick={reset}>{t("reset")}</Button>
      </div>
    </Card>
  );
}
