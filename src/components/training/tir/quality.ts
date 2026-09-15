/** Default render quality from the GPU string — integrated / mobile / software → "low". */
/** GPU heuristic for the default quality: integrated / mobile / software renderers → "low". */
export function detectQuality(): "high" | "low" {
  if (typeof window === "undefined") return "high";
  try {
    if (/Android|iPhone|iPad/i.test(navigator.userAgent)) return "low";
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return "low";
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const r = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    if (/SwiftShader|llvmpipe|Software|Intel|UHD|Iris|HD Graphics|Radeon\(TM\)|Vega [0-9]|Mali|Adreno|PowerVR|Apple GPU/i.test(r)) return "low";
    if ((navigator.hardwareConcurrency ?? 8) <= 4) return "low";
    return "high";
  } catch {
    return "high";
  }
}
