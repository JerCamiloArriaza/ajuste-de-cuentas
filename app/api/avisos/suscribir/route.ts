import { obtenerContexto } from "@/lib/avisos/contexto";
import { avisosConfigurados } from "@/lib/avisos/envio";
import { dentroDelLimite, error, leerJson, mismoOrigen, responder } from "@/lib/avisos/http";
import { suscribir } from "@/lib/avisos/servicio";

export const dynamic = "force-dynamic";

/** Una persona activa los avisos (o cambia qué estados quiere recibir). */
export async function POST(request: Request) {
  if (!mismoOrigen(request)) return error(403, "Origen no permitido.");
  const ctx = obtenerContexto();
  if (!ctx || !avisosConfigurados()) return error(503, "Los avisos todavía no están activos.");
  if (!(await dentroDelLimite(ctx.limitePublico, request))) return error(429, "Demasiados intentos. Prueba más tarde.");
  const cuerpo = await leerJson(request, 4096);
  if (cuerpo === undefined) return error(400, "Datos inválidos.");
  return responder(await suscribir(cuerpo, ctx.almacen));
}
