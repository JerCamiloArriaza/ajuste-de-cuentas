import { obtenerContexto } from "@/lib/avisos/contexto";
import { dentroDelLimite, error, leerJson, mismoOrigen, responder } from "@/lib/avisos/http";
import { cancelar } from "@/lib/avisos/servicio";

export const dynamic = "force-dynamic";

/** Una persona desactiva los avisos: se borra su suscripción. */
export async function POST(request: Request) {
  if (!mismoOrigen(request)) return error(403, "Origen no permitido.");
  const ctx = obtenerContexto();
  if (!ctx) return error(503, "Los avisos todavía no están activos.");
  if (!(await dentroDelLimite(ctx.limitePublico, request))) return error(429, "Demasiados intentos. Prueba más tarde.");
  const cuerpo = await leerJson(request, 2048);
  if (cuerpo === undefined) return error(400, "Datos inválidos.");
  return responder(await cancelar(cuerpo, ctx.almacen));
}
