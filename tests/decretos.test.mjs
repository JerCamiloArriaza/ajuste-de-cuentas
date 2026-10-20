import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { esDecretoDeRecorte, fichaDeDecreto, leerListado, leerRecorte } from "../scripts/decretos.mjs";

const fixture = (n) => fs.readFileSync(new URL(`./fixtures/decreto-${n}.txt`, import.meta.url), "utf8");

describe("lectura de decretos de Dipres", () => {
  it("lee el organismo y el monto del Decreto 331 (Desarrollo Social)", () => {
    const t = fixture("0331");
    expect(esDecretoDeRecorte(t)).toBe(true);
    expect(leerRecorte(t)).toEqual({ organismo: "Ministerio de Desarrollo Social y Familia", montoMillones: 32722 });
  });

  it("usa el monto en pesos cuando el decreto parte en dólares (Decreto 340)", () => {
    expect(leerRecorte(fixture("0340"))).toEqual({ organismo: "Ministerio de Relaciones Exteriores", montoMillones: 1634 });
  });

  it("no inventa datos cuando no encuentra el aporte fiscal (Decreto 350)", () => {
    expect(leerRecorte(fixture("0350"))).toBeNull();
  });

  it("lee el listado HTML", () => {
    const html = `<tr role="row" class="odd"><td>0331</td><td>24-04-2026</td><td>11-06-2026</td>
      <td><a href="https://www.dipres.gob.cl/Decretos/2026/0331_TR.pdf">0331</a></td></tr>`;
    expect(leerListado(html)).toEqual([
      { numero: "0331", fecha: "2026-04-24", tramitado: "2026-06-11", url: "https://www.dipres.gob.cl/Decretos/2026/0331_TR.pdf" },
    ]);
  });

  it("crea una ficha con fuente oficial y marcada por verificar", () => {
    const f = fichaDeDecreto(
      { numero: "0331", fecha: "2026-04-24", tramitado: "2026-06-11", url: "https://x/0331_TR.pdf" },
      { organismo: "Ministerio de Salud", montoMillones: 1000 },
    );
    expect(f.id).toBe("decreto-331-2026");
    expect(f.estado).toBe("aprobado");
    expect(f.verificado).toBe(false);
    expect(f.fuentes[0].tipo).toBe("oficial");
  });
});

describe("el robot no confía en el contenido externo", () => {
  const fila = (url, numero = "0331") =>
    `<tr role="row"><td>${numero}</td><td>24-04-2026</td><td>11-06-2026</td><td><a href="${url}">x</a></td></tr>`;

  it("descarta enlaces que no son PDF de decretos en Dipres", () => {
    for (const malo of [
      "javascript:alert(1)//.pdf",
      "https://sitio-malicioso.example/Decretos/2026/0331_TR.pdf",
      "http://www.dipres.gob.cl/Decretos/2026/0331_TR.pdf",
      "https://www.dipres.gob.cl.evil.example/Decretos/2026/0331_TR.pdf",
    ]) {
      expect(leerListado(fila(malo))).toEqual([]);
    }
  });

  it("descarta filas con número o fecha raros", () => {
    const url = "https://www.dipres.gob.cl/Decretos/2026/0331_TR.pdf";
    expect(leerListado(fila(url, "<script>"))).toEqual([]);
  });

  it("no publica cifras absurdas ni nombres con caracteres raros", () => {
    const base = (monto, nombre) =>
      `Programa 05 APORTE FISCAL LIBRE\n${nombre}\n Miles de $\n 21 Servicio ${monto}\n`;
    expect(leerRecorte(base("99.999.999.999", "MINISTERIO DE SALUD"))).toBeNull();
    expect(leerRecorte(base("1.000.000", "MINISTERIO <img src=x>"))).toBeNull();
  });
});
