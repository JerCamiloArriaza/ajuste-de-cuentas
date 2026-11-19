import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest";

const RAIZ = path.resolve(__dirname, "..");

/** Lee ancho y alto del encabezado (IHDR) de un PNG, sin librerías. */
function dimensionesPng(archivo: string): { ancho: number; alto: number } {
  const b = fs.readFileSync(archivo);
  expect(b.subarray(1, 4).toString("ascii"), archivo).toBe("PNG");
  return { ancho: b.readUInt32BE(16), alto: b.readUInt32BE(20) };
}

describe("app instalable (PWA)", () => {
  const m = manifest();

  it("el manifiesto tiene lo mínimo que exigen los celulares", () => {
    expect(m.name).toBeTruthy();
    expect(m.short_name).toBeTruthy();
    expect(m.start_url).toBe("/");
    expect(m.display).toBe("standalone");
    expect(m.theme_color).toMatch(/^#[0-9a-f]{6}$/i);
    expect(m.background_color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("incluye íconos PNG de 192 y 512 y uno 'maskable'", () => {
    const iconos = m.icons ?? [];
    const tiene = (tam: string, uso: string) => iconos.some((i) => i.sizes === tam && i.type === "image/png" && i.purpose === uso);
    expect(tiene("192x192", "any")).toBe(true);
    expect(tiene("512x512", "any")).toBe(true);
    expect(tiene("512x512", "maskable")).toBe(true);
  });

  it("cada ícono PNG del manifiesto existe y mide lo que dice", () => {
    for (const icono of (m.icons ?? []).filter((i) => i.type === "image/png")) {
      const archivo = path.join(RAIZ, "public", icono.src);
      expect(fs.existsSync(archivo), icono.src).toBe(true);
      const [w, h] = (icono.sizes as string).split("x").map(Number);
      expect(dimensionesPng(archivo), icono.src).toEqual({ ancho: w, alto: h });
    }
  });

  it("existe el ícono para iPhone (180x180)", () => {
    expect(dimensionesPng(path.join(RAIZ, "app/apple-icon.png"))).toEqual({ ancho: 180, alto: 180 });
  });

  it("el service worker y la página sin conexión existen y no guardan cifras", () => {
    const sw = fs.readFileSync(path.join(RAIZ, "public/sw.js"), "utf8");
    expect(fs.existsSync(path.join(RAIZ, "public/offline.html"))).toBe(true);
    expect(sw).toMatch(/offline\.html/);
    // Solo se guarda la página de "sin conexión"; nunca las páginas con cifras.
    expect(sw).not.toMatch(/cache\.put|addAll/);
  });
});
