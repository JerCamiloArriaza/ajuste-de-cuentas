import { createHash } from "node:crypto";
import { ORDEN_ESTADOS, type Estado } from "@/lib/tipos";
import { MAX_EVENTOS_POR_ENVIO, SERVICIOS_DE_AVISOS } from "./config";

/** Suscripción de un celular al servicio de avisos del navegador. */
export type SuscripcionPush = { endpoint: string; keys: { p256dh: string; auth: string } };

/** Una novedad que se avisa: una ficha nueva o un cambio de estado. */
export type EventoAviso = { id: string; titulo: string; estado: Estado; tipo: "nuevo" | "cambio" };

const BASE64URL = /^[A-Za-z0-9_-]+$/;

function largoEnBytes(texto: unknown): number {
  return typeof texto === "string" && BASE64URL.test(texto) ? Buffer.from(texto, "base64url").length : -1;
}

export function hostPermitido(host: string): boolean {
  const h = host.toLowerCase();
  return SERVICIOS_DE_AVISOS.some((s) => (s.startsWith(".") ? h.endsWith(s) : h === s));
}

/** Acepta solo direcciones https de los servicios de avisos conocidos, sin credenciales ni puertos raros. */
export function validarEndpoint(valor: unknown): string | null {
  if (typeof valor !== "string" || valor.length > 700) return null;
  let url: URL;
  try {
    url = new URL(valor);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.username || url.password) return null;
  if (url.port && url.port !== "443") return null;
  if (!hostPermitido(url.hostname)) return null;
  return url.href;
}

export function validarSuscripcion(valor: unknown): SuscripcionPush | null {
  if (!valor || typeof valor !== "object") return null;
  const v = valor as { endpoint?: unknown; keys?: { p256dh?: unknown; auth?: unknown } };
  const endpoint = validarEndpoint(v.endpoint);
  if (!endpoint || !v.keys || typeof v.keys !== "object") return null;
  // p256dh es una clave pública P-256 (65 bytes) y auth un secreto de 16 bytes.
  if (largoEnBytes(v.keys.p256dh) !== 65 || largoEnBytes(v.keys.auth) !== 16) return null;
  return { endpoint, keys: { p256dh: v.keys.p256dh as string, auth: v.keys.auth as string } };
}

/** Estados que la persona quiere recibir: al menos uno, sin repetidos, en el orden de la plataforma. */
export function validarEstados(valor: unknown): Estado[] | null {
  if (!Array.isArray(valor) || valor.length === 0 || valor.length > ORDEN_ESTADOS.length) return null;
  if (!valor.every((e) => typeof e === "string" && (ORDEN_ESTADOS as string[]).includes(e))) return null;
  const unicos = new Set(valor as Estado[]);
  if (unicos.size !== valor.length) return null;
  return ORDEN_ESTADOS.filter((e) => unicos.has(e));
}

export function validarEventos(valor: unknown): EventoAviso[] | null {
  if (!Array.isArray(valor) || valor.length === 0 || valor.length > MAX_EVENTOS_POR_ENVIO) return null;
  const salida: EventoAviso[] = [];
  for (const e of valor) {
    if (!e || typeof e !== "object") return null;
    const { id, titulo, estado, tipo } = e as Record<string, unknown>;
    if (typeof id !== "string" || !/^[a-z0-9-]{1,100}$/.test(id)) return null;
    if (typeof titulo !== "string" || titulo.trim().length === 0 || titulo.length > 300) return null;
    if (typeof estado !== "string" || !(ORDEN_ESTADOS as string[]).includes(estado)) return null;
    if (tipo !== "nuevo" && tipo !== "cambio") return null;
    salida.push({ id, titulo: titulo.trim(), estado: estado as Estado, tipo });
  }
  return salida;
}

/** Identificador estable de una suscripción, sin guardar la dirección completa como clave. */
export function huella(endpoint: string): string {
  return createHash("sha256").update(endpoint).digest("hex").slice(0, 32);
}
