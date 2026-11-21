/*
 * Service worker de Ajuste de Cuentas. Hace tres cosas:
 *  1. Permite que la app se pueda instalar en el celular.
 *  2. Si no hay conexión al abrir una página, muestra un aviso en vez del error del navegador.
 *  3. Recibe los avisos (notificaciones) cuando una medida es nueva o cambia de estado.
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

/** Solo se aceptan rutas de este mismo sitio ("/proyecto/..."), nunca otra dirección. */
function rutaSegura(valor) {
  return typeof valor === "string" && valor.length <= 200 && valor.startsWith("/") && !valor.startsWith("//") ? valor : "/";
}

self.addEventListener("push", (evento) => {
  let datos = {};
  try {
    datos = evento.data ? evento.data.json() : {};
  } catch (e) {
    datos = {};
  }
  const titulo = typeof datos.titulo === "string" && datos.titulo ? datos.titulo.slice(0, 120) : "Ajuste de Cuentas";
  const opciones = {
    body: typeof datos.cuerpo === "string" ? datos.cuerpo.slice(0, 240) : "",
    icon: "/icons/icon-192.png",
    tag: "ajuste-avisos",
    renotify: true,
    data: { url: rutaSegura(datos.url) },
  };
  evento.waitUntil(self.registration.showNotification(titulo, opciones));
});

self.addEventListener("notificationclick", (evento) => {
  evento.notification.close();
  const destino = new URL(rutaSegura(evento.notification.data && evento.notification.data.url), self.location.origin).href;
  evento.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((ventanas) => {
      for (const v of ventanas) {
        if (v.url === destino && "focus" in v) return v.focus();
      }
      return self.clients.openWindow(destino);
    }),
  );
});
