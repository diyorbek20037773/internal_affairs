import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";

const CYCLE = ["vaziyat", "tahlil", "muloqot", "qaror", "harakat", "natija"] as const;
const SHIFT = ["auditoriya", "oqituvchi", "tinglovchi", "test", "sertifikat"] as const;

/** pptx slides 2 & 11: training cycle + "Markaz nimaga aylanadi". */
export async function ModelBanner() {
  const t = await getTranslations("sim.model");
  return (
    <Card className="overflow-hidden">
      <div className="brand-gradient p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/60">{t("cycleTitle")}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {CYCLE.map((c, i) => (
            <span key={c} className="flex items-center gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold ring-1 ring-white/25">
                {t(`cycle.${c}`)}
              </span>
              {i < CYCLE.length - 1 && <span className="text-white/60">→</span>}
            </span>
          ))}
        </div>
        <p className="mt-3 text-sm italic text-white/80">{t("slogan")}</p>
      </div>
      <div className="grid gap-2 p-5 sm:grid-cols-5">
        {SHIFT.map((k) => (
          <div key={k} className="rounded-lg border p-3 text-center text-sm">
            <p className="text-muted-foreground line-through decoration-destructive/60">{t(`shift.${k}.from`)}</p>
            <p className="mt-1 font-semibold text-primary">{t(`shift.${k}.to`)}</p>
          </div>
        ))}
      </div>
      <p className="border-t px-5 py-3 text-center text-xs text-muted-foreground">{t("traektoriya")}</p>
    </Card>
  );
}
