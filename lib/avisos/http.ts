import { createHash, timingSafeEqual } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import type { Redis } from "@upstash/redis";
import { SITIO } from "@/lib/sitio";
import type { Respuesta } from "./servicio";

export const SIN_CACHE = { "Cache-Control": "no-store" } as const;

export function responder(r: Respuesta): Response {
  return Response.json(r.cuerpo, { status: r.estado, headers: SIN_CACHE });
}

export function error(estado: number, mensaje: string): Response {
  return responder({ estado, cuerpo: { error: mensaje } });
}

/** Solo se aceptan peticiones que vengan desde este mismo sitio (los navegadores siempre envían Origin en un POST). */
export function mismoOrigen(request: Request): boolean {
  const origen = request.headers.get("origin");
  if (!origen) return false;
  if (origen === new URL(SITIO).origin) return true;
  return process.env.NODE_ENV !== "production" && /^http:\/\/localhost:\d+$/.test(origen);
}

/** Lee el cuerpo como JSON con un tope de tamaño, para que nadie mande cuerpos enormes. */
export async function leerJson(request: Request, maxBytes: number): Promise<unknown | undefined> {
  if (!(request.headers.get("content-type") ?? "").toLowerCase().includes("application/json")) return undefined;
  const declarado = Number(request.headers.get("content-length") ?? 0);
  if (declarado > maxBytes) return undefined;
  const texto = await request.text();
  if (texto.length > maxBytes) return undefined;
  try {
    return JSON.parse(texto);
  } catch {
    return undefined;
  }
}

/** Comparación en tiempo constante, para no revelar el token por diferencias de tiempo. */
export function tokenValido(recibido: string | null, esperado: string | undefined): boolean {
  if (!esperado || esperado.length < 32 || !recibido) return false;
  const a = Buffer.from(recibido);
  const b = Buffer.from(`Bearer ${esperado}`);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function crearLimitador(redis: Redis, prefijo: string, maximo: number, ventana: `${number} h` | `${number} m`) {
  return new Ratelimit({ redis, prefix: `avisos:rl:${prefijo}`, limiter: Ratelimit.slidingWindow(maximo, ventana) });
}

/** true si la persona todavía puede hacer la petición. Se identifica por una huella de su IP, no por la IP. */
export async function dentroDelLimite(limitador: Ratelimit, request: Request): Promise<boolean> {
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "desconocida";
  const huella = createHash("sha256").update(ip).digest("hex").slice(0, 16);
  return (await limitador.limit(huella)).success;
}
