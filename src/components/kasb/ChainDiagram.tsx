import { useTranslations } from "next-intl";
import {
  ArrowDown,
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  ClipboardCheck,
  Gamepad2,
  IdCard,
  Landmark,
  Layers,
  RefreshCcw,
  Route,
  ScrollText,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Step = { key: string; icon: LucideIcon; href?: string };

/** Upstream: why standards change. */
const UPSTREAM: Step[] = [
  { key: "law", icon: ScrollText, href: "/qonunchilik" },
  { key: "policy", icon: Landmark },
  { key: "needs", icon: TrendingUp },
  { key: "professions", icon: Users, href: "/kasblar" },
];

/** Core: from standard to career. */
const CORE: Step[] = [
  { key: "standard", icon: Briefcase, href: "/kasblar" },
  { key: "competencies", icon: Target, href: "/kasblar" },
  { key: "cluster", icon: Layers, href: "/klasterlar" },
  { key: "subjects", icon: BookOpen, href: "/klasterlar" },
  { key: "practice", icon: ClipboardCheck, href: "/klasterlar" },
  { key: "simulator", icon: Gamepad2, href: "/kasb-simulyator" },
  { key: "assessment", icon: Award, href: "/pasport" },
  { key: "passport", icon: IdCard, href: "/pasport" },
  { key: "career", icon: Route, href: "/pasport" },
];

/**
 * The dynamic standards chain:
 *   Qonunchilik → davlat siyosati → yangi ehtiyojlar → kasblar va kompetensiyalar
 *   → kasb standarti → … → kompetensiya pasporti → karyera.
 *
 * `compact` — one wrapping row of chips (home page, headers).
 * `full` — upstream row + numbered core chain + feedback loop note.
 */
export function ChainDiagram({
  variant = "full",
  className,
  linked = true,
}: {
  variant?: "compact" | "full";
  className?: string;
  /** Render steps as links to the relevant pages. */
  linked?: boolean;
}) {
  const t = useTranslations("kasb.chain");

  if (variant === "compact") {
    return (
      <ol className={cn("flex flex-wrap items-center gap-x-1 gap-y-2 text-xs", className)} aria-label={t("title")}>
        {CORE.map((s, i) => (
          <li key={s.key} className="flex items-center gap-1">
            <StepChip step={s} label={t(`steps.${s.key}`)} linked={linked} />
            {i < CORE.length - 1 && <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" aria-hidden />}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-border/80 bg-card p-4 shadow-card md:p-6", className)}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="label-eyebrow">{t("eyebrow")}</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight">{t("title")}</h3>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Upstream — dynamic drivers */}
      <div className="rounded-xl border border-dashed border-accent/50 bg-accent/5 p-3">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-accent-foreground/80 dark:text-accent">
          {t("upstreamTitle")}
        </p>
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {UPSTREAM.map((s, i) => (
            <li key={s.key} className="relative">
              <StepTile step={s} label={t(`upstream.${s.key}`)} linked={linked} tone="accent" />
              {i < UPSTREAM.length - 1 && (
                <ArrowRight className="absolute -right-2 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 text-accent sm:block" aria-hidden />
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className="flex justify-center py-2" aria-hidden>
        <ArrowDown className="h-5 w-5 text-primary/70" />
      </div>

      {/* Core chain */}
      <ol className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
        {CORE.map((s, i) => (
          <li key={s.key} className="relative">
            <StepTile step={s} label={t(`steps.${s.key}`)} index={i + 1} linked={linked} />
          </li>
        ))}
      </ol>

      <div className="mt-4 flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
        <RefreshCcw className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
        <span>{t("loop")}</span>
      </div>
    </div>
  );
}

function StepChip({ step, label, linked }: { step: Step; label: string; linked: boolean }) {
  const Icon = step.icon;
  const inner = (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-2.5 py-1 font-medium text-foreground/90 transition-colors hover:border-primary/40 hover:text-primary">
      <Icon className="h-3.5 w-3.5 text-primary" aria-hidden />
      {label}
    </span>
  );
  return linked && step.href ? <Link href={step.href}>{inner}</Link> : inner;
}

function StepTile({
  step,
  label,
  index,
  linked,
  tone = "primary",
}: {
  step: Step;
  label: string;
  index?: number;
  linked: boolean;
  tone?: "primary" | "accent";
}) {
  const Icon = step.icon;
  const inner = (
    <span
      className={cn(
        "flex h-full min-h-[84px] flex-col items-center justify-center gap-1.5 rounded-xl border bg-card px-2 py-3 text-center transition-all",
        tone === "accent" ? "border-accent/40" : "border-border/80",
        linked && step.href && "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover"
      )}
    >
      <span
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-lg",
          tone === "accent" ? "bg-accent/15 text-accent-foreground dark:text-accent" : "bg-primary/10 text-primary"
        )}
      >
        <Icon className="h-[18px] w-[18px]" aria-hidden />
        {index !== undefined && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
            {index}
          </span>
        )}
      </span>
      <span className="text-[11px] font-medium leading-tight text-foreground/90 sm:text-xs">{label}</span>
    </span>
  );
  return linked && step.href ? (
    <Link href={step.href} className="block h-full">
      {inner}
    </Link>
  ) : (
    inner
  );
}
