"use client";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

// Gjendja e internetit (online/offline) e lexuar direkt nga shfletuesi.
function degjo(ndrysho: () => void) {
  window.addEventListener("online", ndrysho);
  window.addEventListener("offline", ndrysho);
  return () => {
    window.removeEventListener("online", ndrysho);
    window.removeEventListener("offline", ndrysho);
  };
}

// Java 10: dy ekrane, një gjendje. Paneli dhe "Ndiq kërkesën" lexojnë përsëri nga serveri
// çdo 5 sekonda, pa Refresh. Pa internet shfaqet "Po rilidhemi" dhe mbeten vlerat e fundit.
export default function RifreskoAutomatik({ sekonda = 5 }: { sekonda?: number }) {
  const router = useRouter();
  const online = useSyncExternalStore(degjo, () => navigator.onLine, () => true);

  useEffect(() => {
    const kurKthehet = () => router.refresh();
    window.addEventListener("online", kurKthehet);
    const ora = window.setInterval(() => {
      // Nuk rifreskojmë kur tab-i është i fshehur ose kur s'ka internet.
      if (document.visibilityState === "visible" && navigator.onLine) router.refresh();
    }, sekonda * 1000);
    return () => {
      window.clearInterval(ora);
      window.removeEventListener("online", kurKthehet);
    };
  }, [router, sekonda]);

  if (online) return null;
  return (
    <p role="status" className="vx-rilidhje">
      <span aria-hidden="true" />Po rilidhemi… Po shfaqen vlerat e fundit të ruajtura.
    </p>
  );
}
