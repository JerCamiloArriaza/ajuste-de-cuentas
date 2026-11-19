/*
 * Service worker mínimo. Hace dos cosas:
 *  1. Permite que la app se pueda instalar en el celular.
 *  2. Si no hay conexión al abrir una página, muestra un aviso en vez del error del navegador.
 *
 * A propósito NO guarda copias de las páginas ni de las cifras: en una plataforma que informa recortes,
 * mostrar números desactualizados sin avisar es peor que no mostrar nada. Siempre se pide la versión
 * actual a internet.
 */
const CACHE = "ajuste-sin-conexion-v1";
const SIN_CONEXION = "/offline.html";

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.add(SIN_CONEXION))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((nombres) => Promise.all(nombres.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (evento) => {
  const pedido = evento.request;
  if (pedido.method !== "GET" || pedido.mode !== "navigate") return;
  evento.respondWith(fetch(pedido).catch(() => caches.match(SIN_CONEXION)));
});
