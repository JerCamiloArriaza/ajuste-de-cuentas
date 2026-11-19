import fs from "node:fs";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

const codigo = fs.readFileSync(new URL("../public/sw.js", import.meta.url), "utf8");

/** Ejecuta public/sw.js en un entorno simulado de service worker y devuelve sus manejadores. */
function cargarSW({ enLinea = true } = {}) {
  const manejadores = {};
  const almacen = new Map(); // nombre de caché -> Map(url -> respuesta)
  const eliminados = [];
  const respuestaRed = { origen: "red" };
  const caches = {
    open: async (nombre) => {
      if (!almacen.has(nombre)) almacen.set(nombre, new Map());
      const c = almacen.get(nombre);
      return { add: async (url) => c.set(url, { origen: "cache", url }), put: async (u, r) => c.set(u, r) };
    },
    keys: async () => [...almacen.keys()],
    delete: async (n) => (eliminados.push(n), almacen.delete(n)),
    match: async (url) => {
      for (const c of almacen.values()) if (c.has(url)) return c.get(url);
    },
  };
  const entorno = {
    self: {
      addEventListener: (tipo, fn) => (manejadores[tipo] = fn),
      skipWaiting: async () => {},
      clients: { claim: async () => {} },
    },
    caches,
    fetch: async () => {
      if (!enLinea) throw new Error("sin red");
      return respuestaRed;
    },
  };
  vm.runInNewContext(codigo, entorno);
  const evento = async (tipo, extra = {}) => {
    let promesa;
    await manejadores[tipo]({ waitUntil: (p) => (promesa = p), respondWith: (p) => (promesa = p), ...extra });
    return promesa ? await promesa : undefined;
  };
  return { evento, almacen, eliminados, respuestaRed, manejadores };
}

describe("service worker (modo sin conexión)", () => {
  it("al instalarse guarda solo la página de sin conexión", async () => {
    const sw = cargarSW();
    await sw.evento("install");
    const guardado = [...sw.almacen.values()].flatMap((c) => [...c.keys()]);
    expect(guardado).toEqual(["/offline.html"]);
  });

  it("con internet entrega siempre la página actual, nunca una copia", async () => {
    const sw = cargarSW({ enLinea: true });
    await sw.evento("install");
    const r = await sw.evento("fetch", { request: { method: "GET", mode: "navigate", url: "/proyecto/x" } });
    expect(r.origen).toBe("red");
    // y no guardó la página visitada
    expect([...sw.almacen.values()].flatMap((c) => [...c.keys()])).toEqual(["/offline.html"]);
  });

  it("sin internet muestra el aviso de sin conexión", async () => {
    const sw = cargarSW({ enLinea: false });
    await sw.evento("install");
    const r = await sw.evento("fetch", { request: { method: "GET", mode: "navigate", url: "/proyecto/x" } });
    expect(r).toEqual({ origen: "cache", url: "/offline.html" });
  });

  it("no intercepta imágenes, datos ni peticiones que no son de navegación", async () => {
    const sw = cargarSW({ enLinea: false });
    await sw.evento("install");
    let respondio = false;
    await sw.manejadores.fetch({ request: { method: "GET", mode: "no-cors", url: "/x.png" }, respondWith: () => (respondio = true) });
    await sw.manejadores.fetch({ request: { method: "POST", mode: "navigate", url: "/" }, respondWith: () => (respondio = true) });
    expect(respondio).toBe(false);
  });

  it("al activarse borra cachés de versiones antiguas", async () => {
    const sw = cargarSW();
    sw.almacen.set("ajuste-viejo-v0", new Map());
    await sw.evento("install");
    await sw.evento("activate");
    expect(sw.eliminados).toContain("ajuste-viejo-v0");
    expect(sw.almacen.has("ajuste-sin-conexion-v1")).toBe(true);
  });
});
