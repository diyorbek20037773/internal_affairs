import type { ParsedResponse } from "@/types/chat";

/**
 * Parse a (possibly still-streaming) AI answer into the 6 fixed sections.
 * Robust to markdown heading variants and to multilingual section names
 * (uz/ru/en) since the AI answers in the inspector's language.
 */

const SECTION_PATTERNS: { key: keyof ParsedResponse; re: RegExp }[] = [
  {
    key: "situation",
    re: /(vaziyat|ситуаци|situation)/i,
  },
  {
    key: "firstAction",
    re: /(birinchi\s*harakat|первое\s*действие|first\s*action)/i,
  },
  {
    key: "checklist",
    re: /(checklist|check\s*list|чек-?лист|ro'yxat)/i,
  },
  {
    key: "documents",
    re: /(kerakli\s*hujjatlar|hujjatlar|документ|documents?)/i,
  },
  {
    key: "legalBasis",
    re: /(huquqiy\s*asos|правов|legal\s*basis)/i,
  },
  {
    key: "nextStep",
    re: /(keyingi\s*qadam|следующий\s*шаг|next\s*step)/i,
  },
];

function toItems(block: string): string[] {
  return block
    .split("\n")
    .map((l) =>
      l
        .replace(/^\s*[-*]\s*\[[ xX]\]\s*/, "")
        .replace(/^\s*[-*]\s*/, "")
        .replace(/^\s*\d+[.)]\s*/, "")
        .replace(/^\s*[☐☑✅✔•]\s*/, "")
        .trim()
    )
    .filter((l) => l.length > 0);
}

export function parseResponse(raw: string): ParsedResponse {
  const result: ParsedResponse = {
    checklist: [],
    documents: [],
    raw,
  };

  // Split on markdown headings (##, #, or bold "1." style) — match a heading line
  const lines = raw.split("\n");
  let currentKey: keyof ParsedResponse | null = null;
  const buffers: Partial<Record<keyof ParsedResponse, string[]>> = {};

  const isHeading = (line: string): keyof ParsedResponse | null => {
    const cleaned = line
      .replace(/^#{1,6}\s*/, "")
      .replace(/\*\*/g, "")
      .replace(/^\s*\d+[.)]?\s*/, "")
      .replace(/[#️⃣0-9️⃣]/gu, "")
      .trim();
    // Only treat as heading if the original line looks like one
    const looksLikeHeading =
      /^#{1,6}\s/.test(line) ||
      /^\s*\*\*/.test(line) ||
      /^\s*\d+[.)]\s*\S/.test(line) ||
      /[0-9]️⃣/u.test(line);
    if (!looksLikeHeading) return null;
    for (const { key, re } of SECTION_PATTERNS) {
      if (re.test(cleaned) && cleaned.length < 60) return key;
    }
    return null;
  };

  for (const line of lines) {
    const headingKey = isHeading(line);
    if (headingKey) {
      currentKey = headingKey;
      if (!buffers[currentKey]) buffers[currentKey] = [];
      continue;
    }
    if (currentKey) {
      buffers[currentKey]!.push(line);
    }
  }

  const text = (key: keyof ParsedResponse) =>
    (buffers[key] ?? []).join("\n").trim() || undefined;

  result.situation = text("situation");
  result.firstAction = text("firstAction");
  result.legalBasis = text("legalBasis");
  result.nextStep = text("nextStep");
  result.checklist = buffers.checklist ? toItems(buffers.checklist.join("\n")) : [];
  result.documents = buffers.documents ? toItems(buffers.documents.join("\n")) : [];

  return result;
}
