"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTraineeProfile } from "@/hooks/useTraineeProfile";
import { cn } from "@/lib/utils";

const ROLES = ["trainee", "instructor"] as const;

export function ProfileForm() {
  const t = useTranslations("sim.profile");
  const tc = useTranslations("common");
  const { profile, loaded, save } = useTraineeProfile();

  const [name, setName] = useState("");
  const [badgeId, setBadgeId] = useState("");
  const [rank, setRank] = useState("");
  const [district, setDistrict] = useState("");
  const [role, setRole] = useState<(typeof ROLES)[number]>("trainee");

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

  return (
    <form onSubmit={submit}>
      <Card className="space-y-5 p-5 md:p-6">
        <Field label={t("name")}>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Muminov Joldas Kamalovich" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t("badgeId")}>
            <Input value={badgeId} onChange={(e) => setBadgeId(e.target.value)} placeholder="SH-0473" />
          </Field>
          <Field label={t("rank")}>
            <Input value={rank} onChange={(e) => setRank(e.target.value)} placeholder="mayor" />
          </Field>
        </div>
        <Field label={t("district")}>
          <Input value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="Bog'imaydon MFY, Mirzo Ulug'bek tumani" />
        </Field>
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
        </Field>
        <div className="flex justify-end">
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
