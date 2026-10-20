import { describe, expect, it } from "vitest";
import { contarPorEstado, filtrar, formatearMonto, publicados, tieneFuenteOficial, totales } from "@/lib/proyectos";
import type { Proyecto } from "@/lib/tipos";
import { PROYECTOS } from "@/data/proyectos";

function proyecto(parcial: Partial<Proyecto>): Proyecto {
  return {
    id: "x",
    titulo: "Programa X",
    resumen: "",
    area: "Salud",
    ministerio: "Salud",
    tipo: "recorte",
    estado: "en_proceso",
    fecha: "2026-05-01",
    fuentes: [{ titulo: "DO", url: "https://example.org", tipo: "oficial" }],
    historial: [],
    verificado: true,
    ...parcial,
  };
}

describe("publicación", () => {
  it("oculta los proyectos sin fuente oficial", () => {
    const soloPrensa = proyecto({ id: "a", fuentes: [{ titulo: "Diario", url: "https://x", tipo: "prensa" }] });
    const conOficial = proyecto({ id: "b" });
    expect(publicados([soloPrensa, conOficial]).map((p) => p.id)).toEqual(["b"]);
  });

  it("ordena del más reciente al más antiguo", () => {
    const lista = [proyecto({ id: "viejo", fecha: "2026-03-20" }), proyecto({ id: "nuevo", fecha: "2026-09-01" })];
    expect(publicados(lista).map((p) => p.id)).toEqual(["nuevo", "viejo"]);
  });

  it("todos los datos cargados tienen fuente oficial, id único y fechas válidas", () => {
    const ids = new Set<string>();
    for (const p of PROYECTOS) {
      expect(tieneFuenteOficial(p), p.id).toBe(true);
      expect(ids.has(p.id), `id repetido: ${p.id}`).toBe(false);
      ids.add(p.id);
      expect(p.fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      for (const h of p.historial) expect(h.fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});

describe("filtros", () => {
  const lista = [
    proyecto({ id: "1", estado: "eliminado", area: "Salud", titulo: "Atención primaria" }),
    proyecto({ id: "2", estado: "aprobado", area: "Educación", titulo: "Becas" }),
  ];

  it("filtra por estado y área", () => {
    expect(filtrar(lista, { estado: "eliminado" }).map((p) => p.id)).toEqual(["1"]);
    expect(filtrar(lista, { area: "Educación" }).map((p) => p.id)).toEqual(["2"]);
  });

  it("busca sin importar tildes ni mayúsculas", () => {
    expect(filtrar(lista, { texto: "ATENCION" }).map((p) => p.id)).toEqual(["1"]);
  });

  it("cuenta por estado", () => {
    expect(contarPorEstado(lista)).toEqual({ eliminado: 1, postergado: 0, en_proceso: 0, aprobado: 1 });
  });
});

describe("montos", () => {
  it("separa lo decidido de lo propuesto", () => {
    const lista = [
      proyecto({ id: "a", estado: "aprobado", montoMillones: 100 }),
      proyecto({ id: "b", estado: "en_proceso", montoMillones: 40 }),
      proyecto({ id: "c", estado: "eliminado" }),
    ];
    expect(totales(lista)).toEqual({ decidido: 100, propuesto: 40 });
  });

  it("formatea millones y billones", () => {
    expect(formatearMonto(32722)).toBe("$32.722 millones");
    expect(formatearMonto(1399946)).toBe("$1,4 billones");
  });
});
