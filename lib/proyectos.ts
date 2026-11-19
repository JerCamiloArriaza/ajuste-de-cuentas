import type { Comparacion, Estado, Proyecto, Tipo } from "./tipos";
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
  {
    estado,
    area,
    tipo,
    ministerio,
    texto,
  }: { estado?: Estado | ""; area?: string; tipo?: Tipo | ""; ministerio?: string; texto?: string },
): Proyecto[] {
  const q = normalizar(texto?.trim() ?? "");
  return lista.filter(
    (p) =>
      (!estado || p.estado === estado) &&
      (!area || p.area === area) &&
      (!tipo || p.tipo === tipo) &&
      (!ministerio || p.ministerio === ministerio) &&
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

/** Los decretos de ajuste fiscal se muestran aparte, como ranking, porque son muchos y parecidos. */
export function esDecreto(p: Proyecto): boolean {
  return p.id.startsWith("decreto-");
}

/** Variación porcentual de una comparación (negativa si baja). */
export function variacionPct(c: Comparacion): number {
  return c.antes === 0 ? 0 : ((c.despues - c.antes) / c.antes) * 100;
}

/** "−23,5%", "+19,5%", "−100%". */
export function formatearPct(pct: number): string {
  const n = Math.abs(pct);
  const txt = (n >= 99.95 && n <= 100.05 ? 100 : n).toLocaleString("es-CL", { maximumFractionDigits: 1 });
  return `${pct < 0 ? "−" : "+"}${txt}%`;
}

/** Texto breve para tarjetas y vistas previas al compartir. */
export function resumenTarjeta(p: Proyecto): string {
  if (p.resumenCorto) return p.resumenCorto;
  const afecta = p.resumen.match(/Afecta [^.]*\./)?.[0];
  if (esDecreto(p) && afecta) return afecta;
  const primera = p.resumen.match(/^.*?[.!?](?=\s|$)/)?.[0];
  return primera ?? p.resumen;
}

const NOMBRES_CORTOS: Record<string, string> = {
  "Trabajo y Previsión Social": "Trabajo y previsión",
  "Transportes y Telecomunicaciones": "Transportes",
  "Economía, Fomento y Turismo": "Economía",
  "Ciencia, Tecnología, Conocimiento e Innovación": "Ciencia",
  "Interior y Seguridad Pública": "Interior y Seguridad",
  "Justicia y Derechos Humanos": "Justicia",
  "Mujer y Equidad de Género": "Mujer y Género",
  "Culturas, las Artes y el Patrimonio": "Culturas y Patrimonio",
  "Secretaría General de la Presidencia": "Segpres",
  "Secretaría General de Gobierno": "Segegob",
  "Desarrollo Social y Familia": "Desarrollo Social",
};

/** Nombre corto de un organismo: "Ministerio de Salud" → "Salud". */
export function nombreCorto(organismo: string): string {
  const base = organismo
    .replace(/^Ministerio (de la |de las |del |de los |de )?/, "")
    .replace(/ \(.*\)$/, "")
    .replace(/^de las Culturas/, "Culturas")
    .replace(/^las Culturas/, "Culturas");
  return NOMBRES_CORTOS[base] ?? base;
}
