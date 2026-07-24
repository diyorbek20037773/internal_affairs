import { Card } from "@/components/ui/card";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number | string;
  icon: string;
  accent?: "primary" | "accent" | "success" | "muted";
}) {
  const tone = {
    primary: "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.12)]",
    accent: "bg-accent/15 text-accent shadow-[inset_0_0_0_1px_hsl(var(--accent)/0.18)]",
    success: "bg-success/15 text-success shadow-[inset_0_0_0_1px_hsl(var(--success)/0.18)]",
    muted: "bg-muted text-muted-foreground",
  }[accent ?? "primary"];

  return (
    <Card className="flex items-center gap-4 p-5 transition-shadow hover:shadow-card-hover">
      <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", tone)}>
        <Icon name={icon} className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold leading-none tabular-nums">{value}</p>
        <p className="mt-1.5 truncate text-xs text-muted-foreground">{label}</p>
      </div>
    </Card>
  );
}
