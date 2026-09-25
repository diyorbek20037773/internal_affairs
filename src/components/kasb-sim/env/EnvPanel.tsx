"use client";

import type { EnvKind } from "@/data/kasblar/types";
import { MaterialCard, EmptyEnv, type EnvProps } from "./shared";
import { CaseFile } from "./CaseFile";
import { DutyDesk } from "./DutyDesk";
import { CrimeScene } from "./CrimeScene";
import { CyberSandbox } from "./CyberSandbox";
import { CustomsPost } from "./CustomsPost";
import { AnalyticsMap } from "./AnalyticsMap";
import { ProsecutorReview } from "./ProsecutorReview";
import { Counseling } from "./Counseling";
import { GuardPost } from "./GuardPost";
import { Emergency } from "./Emergency";

const ENVS: Record<EnvKind, (p: EnvProps) => React.ReactElement> = {
  case_file: CaseFile,
  duty_desk: DutyDesk,
  crime_scene: CrimeScene,
  cyber_sandbox: CyberSandbox,
  customs_post: CustomsPost,
  analytics_map: AnalyticsMap,
  prosecutor_review: ProsecutorReview,
  counseling: Counseling,
  guard_post: GuardPost,
  emergency: Emergency,
};

/** Generic fallback: a plain stack of material cards. */
export function GenericEnv({ materials, newIds, locale }: EnvProps) {
  if (!materials.length) return <EmptyEnv />;
  return (
    <div className="space-y-2">
      {materials.map((m) => (
        <MaterialCard key={m.id} m={m} locale={locale} isNew={newIds.has(m.id)} />
      ))}
    </div>
  );
}

export function EnvPanel({ env, ...props }: EnvProps & { env: EnvKind }) {
  const Comp = ENVS[env] ?? GenericEnv;
  return <Comp {...props} />;
}
