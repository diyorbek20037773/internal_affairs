/**
 * Read a string property out of JSON that is still being streamed.
 *
 * Gemini emits the JSON envelope in schema order, so `reply` arrives first and
 * can be shown to the officer while the assessment is still being generated.
 * The text is decoded as far as it is unambiguous: a trailing half-written
 * escape (`\`, `\u12`) is dropped rather than rendered.
 */
export function partialString(raw: string, key: string): string {
  return scanString(raw, key).text;
}

/** The property value once its closing quote has streamed in, else null. */
export function completedString(raw: string, key: string): string | null {
  const r = scanString(raw, key);
  return r.closed ? r.text : null;
}

function scanString(raw: string, key: string): { text: string; closed: boolean } {
  const marker = `"${key}"`;
  const at = raw.indexOf(marker);
  if (at < 0) return { text: "", closed: false };
  let i = at + marker.length;
  while (i < raw.length && /\s/.test(raw[i])) i++;
  if (raw[i] !== ":") return { text: "", closed: false };
  i++;
  while (i < raw.length && /\s/.test(raw[i])) i++;
  if (raw[i] !== '"') return { text: "", closed: false };
  i++;

  let out = "";
  while (i < raw.length) {
    const c = raw[i];
    if (c === '"') return { text: out, closed: true };
    if (c === "\\") {
      const esc = raw[i + 1];
      if (esc === undefined) return { text: out, closed: false }; // incomplete escape → stop here
      if (esc === "u") {
        const hex = raw.slice(i + 2, i + 6);
        if (hex.length < 4) return { text: out, closed: false };
        out += String.fromCharCode(parseInt(hex, 16));
        i += 6;
        continue;
      }
      const map: Record<string, string> = { n: "\n", t: "\t", r: "\r", b: "\b", f: "\f", '"': '"', "\\": "\\", "/": "/" };
      out += map[esc] ?? esc;
      i += 2;
      continue;
    }
    out += c;
    i++;
  }
  return { text: out, closed: false };
}
