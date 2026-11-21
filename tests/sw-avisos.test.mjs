import fs from "node:fs";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

const codigo = fs.readFileSync(new URL("../public/sw.js", import.meta.url), "utf8");

/** Carga public/sw.js en un service worker simulado que registra notificaciones y ventanas abiertas. */
function cargar({ ventanas = [] } = {}) {
  const manejadores = {};
  const mostradas = [];
  const abiertas = [];
  const enfocadas = [];
  const entorno = {
    URL,
    caches: { open: async () => ({ add: async () => {} }), keys: async () => [], delete: async () => true, match: async () => undefined },
    fetch: async () => ({}),
    self: {
      location: { origin: "https://ajuste-de-cuentas.vercel.app" },
      addEventListener: (tipo, fn) => (manejadores[tipo] = fn),
      skipWaiting: async () => {},
      registration: { showNotification: async (titulo, opciones) => mostradas.push({ titulo, opciones }) },
      clients: {
        claim: async () => {},
        matchAll: async () => ventanas.map((url) => ({ url, focus: async () => enfocadas.push(url) })),
        openWindow: async (url) => abiertas.push(url),
      },
    },
  };
  vm.runInNewContext(codigo, entorno);
  const disparar = async (tipo, evento) => {
    let promesa;
    await manejadores[tipo]({ waitUntil: (p) => (promesa = p), ...evento });
    await promesa;
  };
  return { disparar, mostradas, abiertas, enfocadas };
}

const datos = (obj) => ({ data: { json: () => obj } });

describe("service worker: avisos (push)", () => {
  it("muestra la notificación con el texto recibido", async () => {
    const sw = cargar();
    await sw.disparar("push", datos({ titulo: "Aprobado: Recorte de Salud", cuerpo: "Nuevo en Ajuste de Cuentas.", url: "/proyecto/decreto-333-2026" }));
    expect(sw.mostradas).toHaveLength(1);
    expect(sw.mostradas[0].titulo).toBe("Aprobado: Recorte de Salud");
    expect(sw.mostradas[0].opciones.body).toBe("Nuevo en Ajuste de Cuentas.");
    expect(sw.mostradas[0].opciones.data.url).toBe("/proyecto/decreto-333-2026");
    expect(sw.mostradas[0].opciones.icon).toBe("/icons/icon-192.png");
  });

  it("si el mensaje viene vacío o roto, igual muestra algo razonable", async () => {
    const sw = cargar();
    await sw.disparar("push", { data: null });
    await sw.disparar("push", { data: { json: () => { throw new Error("roto"); } } });
    expect(sw.mostradas.map((m) => m.titulo)).toEqual(["Ajuste de Cuentas", "Ajuste de Cuentas"]);
    expect(sw.mostradas[0].opciones.data.url).toBe("/");
  });

  it("nunca acepta enlaces fuera del sitio", async () => {
    const sw = cargar();
    for (const url of ["https://evil.example/", "//evil.example/", "javascript:alert(1)", 42, null]) {
      await sw.disparar("push", datos({ titulo: "x", cuerpo: "y", url }));
    }
    expect(sw.mostradas.every((m) => m.opciones.data.url === "/")).toBe(true);
  });

  it("acorta textos excesivos", async () => {
    const sw = cargar();
    await sw.disparar("push", datos({ titulo: "t".repeat(500), cuerpo: "c".repeat(900) }));
    expect(sw.mostradas[0].titulo.length).toBeLessThanOrEqual(120);
    expect(sw.mostradas[0].opciones.body.length).toBeLessThanOrEqual(240);
  });
});

describe("service worker: tocar el aviso", () => {
  const clic = (url) => ({ notification: { close: () => {}, data: { url } } });

  it("abre la ficha en una ventana nueva", async () => {
    const sw = cargar();
    await sw.disparar("notificationclick", clic("/proyecto/decreto-333-2026"));
    expect(sw.abiertas).toEqual(["https://ajuste-de-cuentas.vercel.app/proyecto/decreto-333-2026"]);
  });

  it("si la ficha ya está abierta, la enfoca en vez de abrir otra", async () => {
    const url = "https://ajuste-de-cuentas.vercel.app/proyecto/x";
    const sw = cargar({ ventanas: [url] });
    await sw.disparar("notificationclick", clic("/proyecto/x"));
    expect(sw.enfocadas).toEqual([url]);
    expect(sw.abiertas).toEqual([]);
  });

  it("un enlace ajeno se convierte en la portada", async () => {
    const sw = cargar();
    await sw.disparar("notificationclick", clic("https://evil.example/phishing"));
    expect(sw.abiertas).toEqual(["https://ajuste-de-cuentas.vercel.app/"]);
  });
});
