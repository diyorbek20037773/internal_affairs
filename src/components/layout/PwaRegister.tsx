"use client";

import { useEffect } from "react";

/** Registers the service worker so the tablet can install HIMOYA-360 as an app ("E-O'quv" tile). */
export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;
    // A new deploy = a new sw.js VERSION (scripts/build-sw.mjs). The new worker
    // skipWaiting()s and claims the page; reload once so the tablet runs the
    // fresh shell instead of a mix of old and new chunks.
    let hadController = Boolean(navigator.serviceWorker.controller);
    const onChange = () => {
      if (hadController) window.location.reload();
      hadController = true;
    };
    navigator.serviceWorker.addEventListener("controllerchange", onChange);
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => { void reg.update().catch(() => undefined); })
      .catch(() => undefined);
    return () => navigator.serviceWorker.removeEventListener("controllerchange", onChange);
  }, []);
  return null;
}
