import { Redis } from "@upstash/redis";
import type { Estado } from "@/lib/tipos";
import { DIAS_DE_VIDA, MAX_SUSCRIPCIONES } from "./config";
import { huella, validarEstados, validarSuscripcion, type SuscripcionPush } from "./validar";

export type Registro = { hash: string; sub: SuscripcionPush; estados: Estado[] };

/** Dónde se guardan las suscripciones. Solo se guarda lo mínimo para poder enviar el aviso. */
export interface Almacen {
  guardar(sub: SuscripcionPush, estados: Estado[]): Promise<"nueva" | "actualizada" | "lleno">;
  borrar(endpoint: string): Promise<void>;
  borrarPorHash(hash: string): Promise<void>;
  todas(): Promise<Registro[]>;
  total(): Promise<number>;
}

/** Versión en memoria, para pruebas. */
export function almacenMemoria(max = MAX_SUSCRIPCIONES): Almacen {
  const datos = new Map<string, { sub: SuscripcionPush; estados: Estado[] }>();
  return {
    async guardar(sub, estados) {
      const h = huella(sub.endpoint);
      const existe = datos.has(h);
      if (!existe && datos.size >= max) return "lleno";
      datos.set(h, { sub, estados });
      return existe ? "actualizada" : "nueva";
    },
    async borrar(endpoint) {
      datos.delete(huella(endpoint));
    },
    async borrarPorHash(hash) {
      datos.delete(hash);
    },
    async todas() {
      return [...datos.entries()].map(([hash, v]) => ({ hash, ...v }));
    },
    async total() {
      return datos.size;
    },
  };
}

const CLAVE = (hash: string) => `avisos:s:${hash}`;
const INDICE = "avisos:ids";

/** Versión real, sobre Upstash Redis. Cada suscripción caduca sola si no se renueva. */
export function almacenUpstash(redis: Redis, max = MAX_SUSCRIPCIONES): Almacen {
  return {
    async guardar(sub, estados) {
      const h = huella(sub.endpoint);
      const existe = (await redis.exists(CLAVE(h))) === 1;
      if (!existe && (await redis.scard(INDICE)) >= max) return "lleno";
      await redis.set(CLAVE(h), JSON.stringify({ sub, estados }), { ex: DIAS_DE_VIDA * 86_400 });
      await redis.sadd(INDICE, h);
      return existe ? "actualizada" : "nueva";
    },
    async borrar(endpoint) {
      const h = huella(endpoint);
      await redis.del(CLAVE(h));
      await redis.srem(INDICE, h);
    },
    async borrarPorHash(hash) {
      await redis.del(CLAVE(hash));
      await redis.srem(INDICE, hash);
    },
    async todas() {
      const ids = (await redis.smembers(INDICE)) as string[];
      const salida: Registro[] = [];
      for (let i = 0; i < ids.length; i += 500) {
        const lote = ids.slice(i, i + 500);
        const valores = await redis.mget<unknown[]>(...lote.map(CLAVE));
        for (let k = 0; k < lote.length; k++) {
          const crudo = valores[k];
          if (crudo === null || crudo === undefined) {
            await redis.srem(INDICE, lote[k]); // ya caducó
            continue;
          }
          try {
            const v = (typeof crudo === "string" ? JSON.parse(crudo) : crudo) as { sub?: unknown; estados?: unknown };
            // Se vuelve a validar al leer: nunca se envía a algo que no pase las reglas actuales.
            const sub = validarSuscripcion(v.sub);
            const estados = validarEstados(v.estados);
            if (sub && estados) salida.push({ hash: lote[k], sub, estados });
          } catch {
            // registro dañado: se ignora
          }
        }
      }
      return salida;
    },
    async total() {
      return redis.scard(INDICE);
    },
  };
}

/** Conecta con Redis si las variables de entorno existen (Vercel las crea al agregar Upstash). */
export function crearRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}
