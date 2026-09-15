"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTraineeProfile } from "@/hooks/useTraineeProfile";
import { cn } from "@/lib/utils";
import { AuthForm } from "./AuthForm";

const ROLES = ["trainee", "instructor"] as const;

export function ProfileForm() {
  const t = useTranslations("sim.profile");
  const tc = useTranslations("common");
  const ta = useTranslations("sim.auth");
  const { profile, loaded, save, authEnabled, authRequired, logout } = useTraineeProfile();

  const [name, setName] = useState("");
  const [badgeId, setBadgeId] = useState("");
  const [rank, setRank] = useState("");
  const [district, setDistrict] = useState("");
  const [role, setRole] = useState<(typeof ROLES)[number]>("trainee");
  const [code, setCode] = useState("");
  const [codeRequired, setCodeRequired] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/instructor-code", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { required?: boolean }) => setCodeRequired(Boolean(d.required)))
      .catch(() => setCodeRequired(false));
  }, []);

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setBadgeId(profile.badgeId);
    setRank(profile.rank);
    setDistrict(profile.district);
    setRole(profile.role);
  }, [profile]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !badgeId.trim()) {
      toast.error(t("required"));
      return;
    }
    // Local mode: the instructor role is protected by the centre's code (INSTRUCTOR_CODE).
    if (!authEnabled && role === "instructor" && profile?.role !== "instructor" && codeRequired) {
      const r = await fetch("/api/auth/instructor-code", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code }) })
        .then((x) => x.json() as Promise<{ ok?: boolean }>)
        .catch(() => ({ ok: false }));
      if (!r.ok) {
        toast.error(t("instructorCodeWrong"));
        return;
      }
    }
    await save({
      name: name.trim(),
      badgeId: badgeId.trim().toUpperCase(),
      rank: rank.trim(),
      district: district.trim(),
      role,
    });
    toast.success(t("saved"));
  };

  if (!loaded) return null;
  if (authRequired) return <AuthForm />;

  return (
    <form onSubmit={submit}>
      <Card className="space-y-5 p-5 md:p-6">
        <p className="text-xs text-muted-foreground">{authEnabled ? t("storageServer") : t("storageDevice")}</p>
        <Field label={t("name")}>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Muminov Joldas Kamalovich" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t("badgeId")}>
            <Input value={badgeId} onChange={(e) => setBadgeId(e.target.value)} placeholder="SH-0473" disabled={authEnabled} />
          </Field>
          <Field label={t("rank")}>
            <Input value={rank} onChange={(e) => setRank(e.target.value)} placeholder="mayor" />
          </Field>
        </div>
        <Field label={t("district")}>
          <Input value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="Bog'imaydon MFY, Mirzo Ulug'bek tumani" />
        </Field>
        {authEnabled ? (
          <p className="text-xs text-muted-foreground">
            {t("role")}: <b>{role === "instructor" ? t("roleInstructor") : t("roleTrainee")}</b> · {ta("roleServer")}
          </p>
        ) : (
        <Field label={t("role")} asDiv>
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={t("role")}>
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                role="radio"
                aria-checked={role === r}
                onClick={() => setRole(r)}
                className={cn(
                  "rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                  role === r
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/40"
                )}
              >
                {r === "trainee" ? t("roleTrainee") : t("roleInstructor")}
              </button>
            ))}
          </div>
          {role === "instructor" && profile?.role !== "instructor" && codeRequired && (
            <div className="mt-2 space-y-1">
              <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder={t("instructorCode")} type="password" autoComplete="off" />
              <p className="text-xs text-muted-foreground">{t("instructorCodeHint")}</p>
            </div>
          )}
        </Field>
        )}
        <div className="flex justify-between gap-3">
          {authEnabled ? (
            <Button type="button" variant="outline" size="lg" onClick={() => void logout()}>
              {ta("logout")}
            </Button>
          ) : (
            <span />
          )}
          <Button type="submit" size="lg">
            {tc("save")}
          </Button>
        </div>
      </Card>
    </form>
  );
}

function Field({ label, children, asDiv }: { label: string; children: React.ReactNode; asDiv?: boolean }) {
  const Tag = asDiv ? "div" : "label";
  return (
    <Tag className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </Tag>
  );
}
