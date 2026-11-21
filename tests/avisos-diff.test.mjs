import { describe, expect, it } from "vitest";
import { calcularEventos } from "../scripts/avisos-diff.mjs";

const ficha = (estado) => ({ estado, titulo: "T" });

describe("avisos: qué novedades detecta el robot", () => {
  it("detecta fichas nuevas y cambios de estado", () => {
    const e = calcularEventos({ a: ficha("en_proceso"), b: ficha("aprobado") }, { a: ficha("aprobado"), b: ficha("aprobado"), c: ficha("eliminado") });
    expect(e).toEqual([
      { id: "a", titulo: "T", estado: "aprobado", tipo: "cambio" },
      { id: "c", titulo: "T", estado: "eliminado", tipo: "nuevo" },
    ]);
  });

  it("no avisa cuando nada cambió ni cuando una ficha desaparece", () => {
    expect(calcularEventos({ a: ficha("aprobado") }, { a: ficha("aprobado") })).toEqual([]);
    expect(calcularEventos({ a: ficha("aprobado"), b: ficha("aprobado") }, { a: ficha("aprobado") })).toEqual([]);
  });

  it("corregir el título no genera aviso", () => {
    expect(calcularEventos({ a: { estado: "aprobado", titulo: "viejo" } }, { a: { estado: "aprobado", titulo: "nuevo" } })).toEqual([]);
  });
});
