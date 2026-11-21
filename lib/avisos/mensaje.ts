import { ESTADOS, type Estado } from "@/lib/tipos";
import type { EventoAviso } from "./validar";

export type Aviso = { titulo: string; cuerpo: string; url: string };

const PLURAL: Record<Estado, [string, string]> = {
  eliminado: ["eliminado", "eliminados"],
  postergado: ["postergado", "postergados"],
  en_proceso: ["en proceso", "en proceso"],
  aprobado: ["aprobado", "aprobados"],
};

const recortar = (t: string, max: number) => (t.length <= max ? t : `${t.slice(0, max - 1).trimEnd()}…`);

/**
 * Arma el aviso que recibe una persona, según los estados que eligió.
 * Si hay una sola novedad, abre su ficha; si hay varias, resume y abre la portada.
 * Devuelve null si ninguna novedad le interesa.
 */
export function armarAviso(eventos: EventoAviso[], estados: Estado[]): Aviso | null {
  const suyos = eventos.filter((e) => estados.includes(e.estado));
  if (suyos.length === 0) return null;

  if (suyos.length === 1) {
    const e = suyos[0];
    return {
      titulo: recortar(`${ESTADOS[e.estado].nombre}: ${e.titulo}`, 90),
      cuerpo: e.tipo === "nuevo" ? "Nuevo en Ajuste de Cuentas. Toca para ver la fuente oficial." : "Cambió de estado. Toca para ver el detalle.",
      url: `/proyecto/${e.id}`,
    };
  }

  const cuentas = new Map<Estado, number>();
  for (const e of suyos) cuentas.set(e.estado, (cuentas.get(e.estado) ?? 0) + 1);
  const resumen = [...cuentas.entries()]
    .map(([estado, n]) => `${n} ${PLURAL[estado][n === 1 ? 0 : 1]}`)
    .join(" · ");
  return {
    titulo: `${suyos.length} novedades en Ajuste de Cuentas`,
    cuerpo: recortar(`${resumen}. Toca para verlas.`, 140),
    url: "/",
  };
}
