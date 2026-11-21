import type { Almacen } from "./almacen";
import { armarAviso, type Aviso } from "./mensaje";
import { validarEndpoint, validarEstados, validarEventos, validarSuscripcion, type EventoAviso, type SuscripcionPush } from "./validar";

export type Respuesta = { estado: number; cuerpo: Record<string, unknown> };

/** Envía un aviso a un celular. Devuelve si salió bien y si la suscripción ya no existe (hay que borrarla). */
export type Enviador = (sub: SuscripcionPush, aviso: Aviso) => Promise<{ ok: boolean; caducada: boolean }>;

const INVALIDO: Respuesta = { estado: 400, cuerpo: { error: "Datos inválidos." } };

export async function suscribir(entrada: unknown, almacen: Almacen): Promise<Respuesta> {
  const e = (entrada ?? {}) as { suscripcion?: unknown; estados?: unknown };
  const sub = validarSuscripcion(e.suscripcion);
  const estados = validarEstados(e.estados);
  if (!sub || !estados) return INVALIDO;
  const r = await almacen.guardar(sub, estados);
  if (r === "lleno") return { estado: 503, cuerpo: { error: "No podemos aceptar más suscripciones por ahora." } };
  return { estado: 200, cuerpo: { ok: true, estados } };
}

/** Cancelar siempre responde bien, exista o no la suscripción: así no se puede usar para averiguar nada. */
export async function cancelar(entrada: unknown, almacen: Almacen): Promise<Respuesta> {
  const endpoint = validarEndpoint((entrada as { endpoint?: unknown } | null)?.endpoint);
  if (!endpoint) return INVALIDO;
  await almacen.borrar(endpoint);
  return { estado: 200, cuerpo: { ok: true } };
}

async function enParalelo<T>(items: T[], limite: number, tarea: (x: T) => Promise<void>): Promise<void> {
  let siguiente = 0;
  const trabajadores = Array.from({ length: Math.min(limite, items.length) }, async () => {
    while (siguiente < items.length) await tarea(items[siguiente++]);
  });
  await Promise.all(trabajadores);
}

export type ResultadoEnvio = { suscritas: number; enviados: number; caducadas: number; fallidas: number; sinInteres: number };

/** Envía un solo aviso por persona con las novedades que le interesan; borra las suscripciones caducadas. */
export async function enviarAvisos(args: { eventos: unknown; almacen: Almacen; enviar: Enviador; simultaneos?: number }): Promise<Respuesta> {
  const eventos: EventoAviso[] | null = validarEventos(args.eventos);
  if (!eventos) return INVALIDO;
  const registros = await args.almacen.todas();
  const r: ResultadoEnvio = { suscritas: registros.length, enviados: 0, caducadas: 0, fallidas: 0, sinInteres: 0 };

  await enParalelo(registros, args.simultaneos ?? 20, async (reg) => {
    const aviso = armarAviso(eventos, reg.estados);
    if (!aviso) {
      r.sinInteres++;
      return;
    }
    const res = await args.enviar(reg.sub, aviso).catch(() => ({ ok: false, caducada: false }));
    if (res.ok) r.enviados++;
    else if (res.caducada) {
      r.caducadas++;
      await args.almacen.borrarPorHash(reg.hash);
    } else r.fallidas++;
  });
  return { estado: 200, cuerpo: { ok: true, ...r } };
}
