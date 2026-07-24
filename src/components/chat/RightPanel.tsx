"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  CheckCircle2,
  Circle,
  FileText,
  Scale,
  ListChecks,
  Workflow as WorkflowIcon,
  AlertTriangle,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSop } from "@/data/sops";
import { localized } from "@/data/sops/types";
import type { WorkflowState } from "@/lib/storage/schema";
import type { ParsedResponse } from "@/types/chat";
import { cn } from "@/lib/utils";

interface RightPanelProps {
  state?: WorkflowState;
  parsed: ParsedResponse;
  onToggleItem: (id: string) => void;
  onCompleteStep: () => void;
}

function EmptyHint({ text }: { text: string }) {
  return (
    <p className="px-1 py-6 text-center text-sm text-muted-foreground">{text}</p>
  );
}

export function RightPanel({
  state,
  parsed,
  onToggleItem,
  onCompleteStep,
}: RightPanelProps) {
  const t = useTranslations("chat");
  const tc = useTranslations("common");
  const locale = useLocale();

  const sop = state ? getSop(state.sopType) : null;
  const currentStep = sop?.steps.find((s) => s.id === state?.currentStepId);
  const currentChecklist = currentStep?.checklist ?? [];
  const stepDocs = currentStep?.documents ?? [];
  const stepLaws = currentStep?.laws ?? [];

  return (
    <Tabs defaultValue="checklist" className="flex h-full flex-col">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="checklist" className="gap-1.5">
          <ListChecks className="h-4 w-4" />
          <span className="hidden lg:inline">{t("panel.checklist")}</span>
        </TabsTrigger>
        <TabsTrigger value="process" className="gap-1.5">
          <WorkflowIcon className="h-4 w-4" />
          <span className="hidden lg:inline">{t("panel.process")}</span>
        </TabsTrigger>
        <TabsTrigger value="documents" className="gap-1.5">
          <FileText className="h-4 w-4" />
          <span className="hidden lg:inline">{t("panel.documents")}</span>
        </TabsTrigger>
        <TabsTrigger value="laws" className="gap-1.5">
          <Scale className="h-4 w-4" />
          <span className="hidden lg:inline">{t("panel.laws")}</span>
        </TabsTrigger>
      </TabsList>

      <div className="mt-2 min-h-0 flex-1">
        {/* CHECKLIST */}
        <TabsContent value="checklist" className="mt-0 h-full">
          <ScrollArea className="h-full pr-2">
            {currentChecklist.length === 0 && parsed.checklist.length === 0 ? (
              <EmptyHint text={t("noChecklist")} />
            ) : (
              <div className="space-y-2 p-1">
                {currentChecklist.map((item) => {
                  const checked = state?.checkedItemIds.includes(item.id);
                  return (
                    <label
                      key={item.id}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                        checked ? "border-success/40 bg-success/5" : "hover:bg-muted/50"
                      )}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => onToggleItem(item.id)}
                        className="mt-0.5"
                      />
                      <span
                        className={cn(
                          "text-sm",
                          checked && "text-muted-foreground line-through"
                        )}
                      >
                        {localized(item.label, locale)}
                        {item.required && (
                          <span className="ml-1 text-destructive">*</span>
                        )}
                      </span>
                    </label>
                  );
                })}

                {parsed.checklist.length > 0 && (
                  <div className="pt-2">
                    <p className="px-1 pb-1 text-xs font-medium text-muted-foreground">
                      AI
                    </p>
                    {parsed.checklist.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 rounded-md px-1 py-1.5 text-sm"
                      >
                        <Circle className="mt-1 h-3 w-3 shrink-0 text-muted-foreground" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        {/* PROCESS */}
        <TabsContent value="process" className="mt-0 h-full">
          <ScrollArea className="h-full pr-2">
            {!sop ? (
              <EmptyHint text={t("noProcess")} />
            ) : (
              <div className="space-y-1 p-1">
                {sop.steps.map((step, idx) => {
                  const done = state?.completedStepIds.includes(step.id);
                  const current = state?.currentStepId === step.id;
                  return (
                    <div
                      key={step.id}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border p-3",
                        current && "border-primary/50 bg-primary/5",
                        done && "opacity-70"
                      )}
                    >
                      {done ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                      ) : (
                        <span
                          className={cn(
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                            current
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {idx + 1}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium">
                          {localized(step.title, locale)}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {localized(step.instruction, locale)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {currentStep && (
                  <Button
                    className="mt-3 w-full"
                    variant="accent"
                    onClick={onCompleteStep}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {t("step")} ✓
                  </Button>
                )}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        {/* DOCUMENTS */}
        <TabsContent value="documents" className="mt-0 h-full">
          <ScrollArea className="h-full pr-2">
            {stepDocs.length === 0 && parsed.documents.length === 0 ? (
              <EmptyHint text={t("noDocs")} />
            ) : (
              <div className="space-y-2 p-1">
                {stepDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm">{localized(doc.name, locale)}</span>
                    <Badge variant="secondary" className="ml-auto capitalize">
                      {doc.kind}
                    </Badge>
                  </div>
                ))}
                {parsed.documents.map((doc, i) => (
                  <div
                    key={`ai-${i}`}
                    className="flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        {/* LAWS */}
        <TabsContent value="laws" className="mt-0 h-full">
          <ScrollArea className="h-full pr-2">
            {stepLaws.length === 0 && !parsed.legalBasis ? (
              <EmptyHint text={t("noLaws")} />
            ) : (
              <div className="space-y-2 p-1">
                {stepLaws.map((law, i) => (
                  <div key={i} className="rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm font-medium">{law.code}</span>
                      {law.article && (
                        <Badge variant="accent">{law.article}</Badge>
                      )}
                    </div>
                    {!law.verified && (
                      <div className="mt-2 flex items-start gap-1.5 rounded-md bg-accent/10 p-2 text-xs text-accent-foreground/90">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                        <span>{tc("verifyOfficial")}</span>
                      </div>
                    )}
                    {law.note && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {law.note}
                      </p>
                    )}
                  </div>
                ))}
                {parsed.legalBasis && (
                  <div className="rounded-lg border border-dashed p-3">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      AI
                    </p>
                    <p className="whitespace-pre-wrap text-sm">
                      {parsed.legalBasis}
                    </p>
                  </div>
                )}
                <div className="flex items-start gap-1.5 rounded-md bg-muted p-2 text-xs text-muted-foreground">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{tc("disclaimer")}</span>
                </div>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </div>
    </Tabs>
  );
}
