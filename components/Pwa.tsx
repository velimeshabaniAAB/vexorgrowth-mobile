"use client";
import { useEffect, useSyncExternalStore } from "react";

function degjo(ndrysho: () => void) {
  window.addEventListener("online", ndrysho);
  window.addEventListener("offline", ndrysho);
  return () => {
    window.removeEventListener("online", ndrysho);
    window.removeEventListener("offline", ndrysho);
  };
}

export default function Pwa() {
  const online = useSyncExternalStore(degjo, () => navigator.onLine, () => true);
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    let cancelled = false;
    // Server rendering nuk mbush cache-n e JSON-it. E kërkojmë një herë këtu.
    async function warmSnapshot() {
      if (cancelled || !navigator.serviceWorker.controller) return;
      try { await fetch("/api/sherbimet", { cache: "no-store" }); } catch { /* offline */ }
    }
    navigator.serviceWorker.addEventListener("controllerchange", warmSnapshot);
    navigator.serviceWorker.register("/sw.js", { scope: "/" })
      .then(() => navigator.serviceWorker.ready).then(warmSnapshot).catch(() => {});
    return () => {
      cancelled = true;
      navigator.serviceWorker.removeEventListener("controllerchange", warmSnapshot);
    };
  }, []);
  // Shiriti del vetëm kur s'ka internet.
  if (online) return null;
  return <aside className="pwa-shirit" role="status">
    <span className="pwa-pika" aria-hidden="true" />
    <p><strong>You’re offline.</strong> The saved copy may be out of date. Requests can only be sent online.</p>
    <a href="/offline.html">View the saved list</a>
  </aside>;
}