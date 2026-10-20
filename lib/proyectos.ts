import type { Estado, Proyecto } from "./tipos";
import { PROYECTOS } from "@/data/proyectos";

/** Solo se publica lo que tiene al menos una fuente oficial. */
export function tieneFuenteOficial(p: Proyecto): boolean {
  return p.fuentes.some((f) => f.tipo === "oficial" && f.url.trim() !== "");
}

/** Proyectos publicables, del más reciente al más antiguo. */
export function publicados(lista: Proyecto[] = PROYECTOS): Proyecto[] {
  return lista
    .filter(tieneFuenteOficial)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export function buscarPorId(id: string): Proyecto | undefined {
  return publicados().find((p) => p.id === id);
}

function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function filtrar(
  lista: Proyecto[],
  { estado, area, texto }: { estado?: Estado | ""; area?: string; texto?: string },
): Proyecto[] {
  const q = normalizar(texto?.trim() ?? "");
  return lista.filter(
    (p) =>
      (!estado || p.estado === estado) &&
      (!area || p.area === area) &&
      (!q || normalizar(`${p.titulo} ${p.resumen} ${p.ministerio}`).includes(q)),
  );
}

export function contarPorEstado(lista: Proyecto[]): Record<Estado, number> {
  const c: Record<Estado, number> = { eliminado: 0, postergado: 0, en_proceso: 0, aprobado: 0 };
  for (const p of lista) c[p.estado]++;
  return c;
}

export function formatearFecha(iso: string): string {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, d)).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Suma de montos (millones de $), separando lo ya decidido de lo propuesto. */
export function totales(lista: Proyecto[]): { decidido: number; propuesto: number } {
  let decidido = 0;
  let propuesto = 0;
  for (const p of lista) {
    if (!p.montoMillones) continue;
    if (p.estado === "en_proceso") propuesto += p.montoMillones;
    else decidido += p.montoMillones;
  }
  return { decidido, propuesto };
}

/** 1.399.946 → "$1,4 billones"; 32.722 → "$32.722 millones". */
export function formatearMonto(millones: number): string {
  if (millones >= 1_000_000) {
    const billones = millones / 1_000_000;
    return `$${billones.toLocaleString("es-CL", { maximumFractionDigits: 2 })} billones`;
  }
  return `$${millones.toLocaleString("es-CL")} millones`;
}
