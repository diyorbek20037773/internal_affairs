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
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/15 text-accent",
    success: "bg-success/15 text-success",
    muted: "bg-muted text-muted-foreground",
  }[accent ?? "primary"];

  return (
    <Card className="flex items-center gap-4 p-5">
      <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", tone)}>
        <Icon name={icon} className="h-6 w-6" />
      </div>
      <div>
        <p className="text-2xl font-bold leading-none tabular-nums">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      </div>
    </Card>
  );
}
