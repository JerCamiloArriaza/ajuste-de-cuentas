import type { Ratelimit } from "@upstash/ratelimit";
import { almacenUpstash, crearRedis, type Almacen } from "./almacen";
import { crearLimitador } from "./http";

export type Contexto = { almacen: Almacen; limitePublico: Ratelimit; limiteAdmin: Ratelimit };

let guardado: Contexto | null | undefined;

/** Almacén y límites de uso. Es null mientras no se haya conectado la base de datos en Vercel. */
export function obtenerContexto(): Contexto | null {
  if (guardado !== undefined) return guardado;
  const redis = crearRedis();
  guardado = redis
    ? {
        almacen: almacenUpstash(redis),
        limitePublico: crearLimitador(redis, "publico", 20, "1 h"),
        limiteAdmin: crearLimitador(redis, "admin", 30, "1 h"),
      }
    : null;
  return guardado;
}
