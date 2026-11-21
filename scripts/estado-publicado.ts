import { PROYECTOS } from "@/data/proyectos";
import { publicados } from "@/lib/proyectos";
import { ESTADOS } from "@/lib/tipos";

export type EstadoPublicado = Record<string, { estado: string; titulo: string }>;

/** Lo que hoy se ve en la web: cada ficha publicada con su estado. Lo usa el robot de avisos. */
export function estadoPublicado(): EstadoPublicado {
  const salida: EstadoPublicado = {};
  for (const p of publicados(PROYECTOS)) salida[p.id] = { estado: p.estado, titulo: p.titulo };
  return salida;
}

export const NOMBRES_ESTADO: Record<string, string> = Object.fromEntries(Object.entries(ESTADOS).map(([k, v]) => [k, v.nombre]));
