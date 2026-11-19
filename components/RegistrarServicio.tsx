"use client";

import { useEffect } from "react";

/** Registra el service worker que hace instalable la app. Solo en producción. */
export function RegistrarServicio() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      // Sin service worker la web funciona igual; solo no se podrá instalar.
    });
  }, []);
  return null;
}
