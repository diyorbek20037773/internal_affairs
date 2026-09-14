"use client";

import { useEffect } from "react";

/** Registers the service worker so the tablet can install HIMOYA-360 as an app ("E-O'quv" tile). */
export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;
    navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);
  return null;
}
