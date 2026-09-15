"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { LogIn, UserPlus, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTraineeProfile } from "@/hooks/useTraineeProfile";
import { cn } from "@/lib/utils";

type Mode = "login" | "register";

/** Badge ID + PIN sign-in shown on /profil when the server store is on and nobody is logged in. */
export function AuthForm() {
  const t = useTranslations("sim.auth");
  const { login, register } = useTraineeProfile();
  const [mode, setMode] = useState<Mode>("login");
  const [badgeId, setBadgeId] = useState("");
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [rank, setRank] = useState("");
  const [district, setDistrict] = useState("");
  const [busy, setBusy] = useState(false);

  const errorText = (code: string) => {
    switch (code) {
      case "invalid_credentials":
        return t("errInvalid");
      case "locked":
        return t("errLocked");
      case "badge_taken":
        return t("errTaken");
      case "store_unavailable":
        return t("errServer");
      default:
        return t("errBad");
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!badgeId.trim() || !/^\d{4,8}$/.test(pin)) {
      toast.error(t("pinRule"));
      return;
    }
    if (mode === "register" && !name.trim()) {
      toast.error(t("nameRequired"));
      return;
    }
    setBusy(true);
    try {
      const r =
        mode === "login"
          ? await login(badgeId.trim(), pin)
          : await register({ badgeId: badgeId.trim(), pin, name: name.trim(), rank: rank.trim(), district: district.trim() });
      if (r.ok) toast.success(t("welcome"));
      else toast.error(errorText(r.error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} data-testid="auth-form">
      <Card className="space-y-5 p-5 md:p-6">
        <div className="flex items-start gap-3 rounded-lg border border-dashed p-3 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>{t("intro")}</span>
        </div>

        <div className="grid grid-cols-2 gap-2" role="tablist">
          {(["login", "register"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                mode === m ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40"
              )}
            >
              {m === "login" ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
              {m === "login" ? t("login") : t("register")}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">{t("badgeId")}</span>
            <Input
              name="badgeId"
              autoComplete="username"
              value={badgeId}
              onChange={(e) => setBadgeId(e.target.value.toUpperCase())}
              placeholder="SH-0473"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">{t("pin")}</span>
            <Input
              name="pin"
              type="password"
              inputMode="numeric"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))}
              placeholder="••••"
            />
          </label>
        </div>

        {mode === "register" && (
          <>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">{t("name")}</span>
              <Input name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Muminov Joldas Kamalovich" />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">{t("rank")}</span>
                <Input name="rank" value={rank} onChange={(e) => setRank(e.target.value)} placeholder="mayor" />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">{t("district")}</span>
                <Input name="district" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="Bog'imaydon MFY" />
              </label>
            </div>
          </>
        )}

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={busy}>
            {mode === "login" ? t("login") : t("register")}
          </Button>
        </div>
      </Card>
    </form>
  );
}
