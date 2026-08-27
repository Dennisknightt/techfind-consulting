"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return; // avoid caching interference during dev

    let reg: ServiceWorkerRegistration | null = null;

    navigator.serviceWorker
      .register("/os-sw.js", { scope: "/app" })
      .then((registration) => {
        reg = registration;

        registration.addEventListener("updatefound", () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              toast("A new version of Techfind is available", {
                action: {
                  label: "Refresh",
                  onClick: () => {
                    installing.postMessage("SKIP_WAITING");
                    window.location.reload();
                  },
                },
                duration: 15000,
              });
            }
          });
        });
      })
      .catch(() => {
        // PWA install/offline support is a progressive enhancement — never block the app on it.
      });

    return () => { void reg; };
  }, []);

  return null;
}
