// Kjo cache përmban VETËM dokumentin offline, ikonat dhe listën publike të shërbimeve.
const CACHE = "vexor-public-v3";
const API = "/api/sherbimet";
const SHELL = ["/offline.html", "/logo-rreth.png", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL))
    .then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys
    .filter(key => key.startsWith("vexor-public-") && key !== CACHE)
    .map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

async function readPublicList(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Lista nuk erdhi nga serveri");
    }
    const headers = new Headers(response.headers);
    headers.set("x-vexor-source", "network");
    headers.set("x-vexor-saved-at", new Date().toISOString());
    const fresh = new Response(await response.text(), { status: 200, headers });
    // Nëse hapësira lokale është plot, lista nga serveri prapë shfaqet.
    try { await cache.put(API, fresh.clone()); } catch {
      // Mos pretendo ruajtje kur pajisja nuk e pranoi kopjen.
      fresh.headers.delete("x-vexor-saved-at");
    }
    return fresh;
  } catch {
    const saved = await cache.match(API);
    if (!saved) return new Response(JSON.stringify({ error: "no_snapshot" }), {
      status: 503, headers: { "content-type": "application/json" },
    });
    const headers = new Headers(saved.headers);
    headers.set("x-vexor-source", "cache");
    return new Response(await saved.text(), { status: 200, headers });
  }
}

self.addEventListener("fetch", event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (url.pathname === API && !url.search) {
    event.respondWith(readPublicList(request));
  } else if (url.pathname === "/logo-rreth.png") {
    // Logoja për faqen offline: nga cache-i kur s'ka internet.
    event.respondWith(fetch(request).catch(async () =>
      (await (await caches.open(CACHE)).match("/logo-rreth.png")) || Response.error()));
  } else if (request.mode === "navigate") {
    // Çdo faqe që nuk hapet pa internet tregon faqen offline (jo të dhëna private të ruajtura).
        event.respondWith(fetch(request).catch(async () => {
      const saved = await (await caches.open(CACHE)).match("/offline.html");
      return saved || new Response("Hape Vexor Growth një herë me internet.", {
        status: 503, headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }));
  }
  // Përmbajtja e /panel, /api/auth, kërkesave dhe POST-eve nuk ruhet kurrë në cache.
});