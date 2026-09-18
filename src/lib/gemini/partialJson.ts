/**
 * Read a string property out of JSON that is still being streamed.
 *
 * Gemini emits the JSON envelope in schema order, so `reply` arrives first and
 * can be shown to the officer while the assessment is still being generated.
 * The text is decoded as far as it is unambiguous: a trailing half-written
 * escape (`\`, `\u12`) is dropped rather than rendered.
 */
export function partialString(raw: string, key: string): string {
  const marker = `"${key}"`;
  const at = raw.indexOf(marker);
  if (at < 0) return "";
  let i = at + marker.length;
  while (i < raw.length && /\s/.test(raw[i])) i++;
  if (raw[i] !== ":") return "";
  i++;
  while (i < raw.length && /\s/.test(raw[i])) i++;
  if (raw[i] !== '"') return "";
  i++;

  let out = "";
  while (i < raw.length) {
    const c = raw[i];
    if (c === '"') return out; // closed
    if (c === "\\") {
      const esc = raw[i + 1];
      if (esc === undefined) return out; // incomplete escape → stop here
      if (esc === "u") {
        const hex = raw.slice(i + 2, i + 6);
        if (hex.length < 4) return out;
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
  return out;
}
