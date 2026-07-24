import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/icon";

export function FeatureCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className="group block">
      <Card className="relative h-full overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover">
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-accent via-primary to-accent transition-transform duration-300 group-hover:scale-x-100"
        />
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.12)] transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-glow">
          <Icon name={icon} className="h-6 w-6" />
        </div>
        <h3 className="flex items-center gap-1.5 font-semibold tracking-tight">
          {title}
          <ArrowRight className="h-4 w-4 -translate-x-1 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/15 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
      </Card>
    </Link>
  );
}
