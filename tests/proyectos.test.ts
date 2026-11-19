import { describe, expect, it } from "vitest";
import { contarPorEstado, esDecreto, filtrar, formatearMonto, formatearPct, nombreCorto, publicados, resumenTarjeta, tieneFuenteOficial, totales, variacionPct } from "@/lib/proyectos";
import type { Proyecto } from "@/lib/tipos";
import { PROYECTOS } from "@/data/proyectos";
import { esUrlSegura } from "@/lib/urls";

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

describe("seguridad de los datos", () => {
  it("todas las fuentes son enlaces http(s) válidos", () => {
    for (const p of PROYECTOS) for (const f of p.fuentes) expect(esUrlSegura(f.url), `${p.id}: ${f.url}`).toBe(true);
  });

  it("rechaza enlaces peligrosos", () => {
    for (const malo of ["javascript:alert(1)", "data:text/html,<script>1</script>", "vbscript:x", "no es url"]) {
      expect(esUrlSegura(malo)).toBe(false);
    }
  });

  it("los ids solo usan letras, números y guiones (van en la dirección de la página)", () => {
    for (const p of PROYECTOS) expect(p.id, p.id).toMatch(/^[a-z0-9-]+$/);
  });

  it("los registros automáticos solo citan PDF de Dipres", () => {
    for (const p of PROYECTOS.filter((p) => p.automatico)) {
      for (const f of p.fuentes) expect(f.url).toMatch(/^https:\/\/www\.dipres\.gob\.cl\/Decretos\//);
    }
  });
});

describe("fichas verificadas", () => {
  it("toda ficha verificada cita al menos una fuente oficial", () => {
    for (const p of PROYECTOS.filter((p) => p.verificado)) expect(tieneFuenteOficial(p), p.id).toBe(true);
  });

  it("ninguna ficha cuenta como recorte si no tiene monto ni es un seguimiento", () => {
    // Un decreto que AUMENTA fondos (como el N°373 de Bienes Nacionales) no debe aparecer como recorte.
    expect(PROYECTOS.some((p) => p.id === "decreto-373-2026")).toBe(false);
  });
});

describe("vista de la portada", () => {
  it("las comparaciones tienen cifras coherentes", () => {
    for (const p of PROYECTOS.filter((p) => p.comparacion)) {
      const c = p.comparacion!;
      expect(c.antes, p.id).toBeGreaterThan(0);
      expect(c.despues, p.id).toBeGreaterThanOrEqual(0);
    }
  });

  it("calcula y formatea la variación", () => {
    expect(variacionPct({ etiqueta: "x", antes: 100, despues: 80 })).toBe(-20);
    expect(formatearPct(-23.5)).toBe("−23,5%");
    expect(formatearPct(19.5)).toBe("+19,5%");
    expect(formatearPct(-100)).toBe("−100%");
  });

  it("distingue decretos de las demás fichas y arma el texto de tarjeta", () => {
    const decreto = proyecto({ id: "decreto-1-2026", resumen: "El Decreto reduce fondos. Afecta a Fonasa y al ISP. Otro texto." });
    expect(esDecreto(decreto)).toBe(true);
    expect(resumenTarjeta(decreto)).toBe("Afecta a Fonasa y al ISP.");
    expect(resumenTarjeta(proyecto({ resumen: "Primera frase. Segunda frase." }))).toBe("Primera frase.");
    expect(resumenTarjeta(proyecto({ resumenCorto: "Corto.", resumen: "Largo. Muy largo." }))).toBe("Corto.");
  });

  it("filtra por tipo y ministerio", () => {
    const lista = [
      proyecto({ id: "1", tipo: "recorte", ministerio: "Ministerio de Salud" }),
      proyecto({ id: "2", tipo: "retiro", ministerio: "Ministerio de Educación" }),
    ];
    expect(filtrar(lista, { tipo: "retiro" }).map((p) => p.id)).toEqual(["2"]);
    expect(filtrar(lista, { ministerio: "Ministerio de Salud" }).map((p) => p.id)).toEqual(["1"]);
  });

  it("no hay ministerios ni áreas duplicados por variantes de escritura", () => {
    const ministerios = new Set(PROYECTOS.map((p) => p.ministerio));
    expect(ministerios.has("Ministerio de Hacienda (Dipres)")).toBe(false);
    expect(ministerios.has("Ministerio de Trabajo y Previsión Social")).toBe(false);
    const areas = new Set(PROYECTOS.map((p) => p.area));
    expect(areas.has("Otra")).toBe(false);
  });
});

describe("nombres cortos", () => {
  it("acorta los ministerios para ranking y filtros", () => {
    expect(nombreCorto("Ministerio de Salud")).toBe("Salud");
    expect(nombreCorto("Ministerio del Trabajo y Previsión Social")).toBe("Trabajo y previsión");
    expect(nombreCorto("Ministerio de las Culturas, las Artes y el Patrimonio")).toBe("Culturas y Patrimonio");
    expect(nombreCorto("Ministerio Secretaría General de Gobierno")).toBe("Segegob");
    expect(nombreCorto("Tesoro Público (subsidios y prestaciones)")).toBe("Tesoro Público");
    expect(nombreCorto("Servicio Electoral")).toBe("Servicio Electoral");
  });
});

describe("posturas: explicación del Gobierno y críticas", () => {
  const todas = PROYECTOS.flatMap((p) => [...(p.justificacionOficial ?? []), ...(p.criticas ?? [])].map((x) => ({ p, x })));

  it("toda postura tiene autor, texto y una fuente que se puede abrir", () => {
    expect(todas.length).toBeGreaterThan(30);
    for (const { p, x } of todas) {
      expect(x.autor.trim().length, p.id).toBeGreaterThan(3);
      expect(x.texto.trim().length, `${p.id} / ${x.autor}`).toBeGreaterThan(30);
      expect(esUrlSegura(x.fuente.url), `${p.id} / ${x.autor}`).toBe(true);
      expect(x.fuente.titulo.trim().length, p.id).toBeGreaterThan(5);
    }
  });

  it("los textos son resúmenes breves, no transcripciones", () => {
    for (const { p, x } of todas) expect(x.texto.length, `${p.id} / ${x.autor}`).toBeLessThan(620);
  });

  it("no hay críticas anónimas", () => {
    for (const p of PROYECTOS) {
      for (const c of p.criticas ?? []) expect(/an[oó]nim|fuentes? (cercanas?|reservadas?)|se dice|algunos/i.test(c.autor), `${p.id} / ${c.autor}`).toBe(false);
    }
  });

  it("todos los decretos de ajuste explican su origen en la Circular 12", () => {
    for (const p of PROYECTOS.filter((p) => esDecreto(p))) {
      expect(p.justificacionOficial?.some((x) => /Circular N°12/.test(x.autor)), p.id).toBe(true);
    }
  });

  it("los decretos con más polémica incluyen críticas de distintos sectores", () => {
    const salud = PROYECTOS.find((p) => p.id === "decreto-333-2026")!;
    expect(salud.criticas!.length).toBeGreaterThanOrEqual(3);
    expect(salud.justificacionOficial!.length).toBeGreaterThanOrEqual(2);
  });
});
