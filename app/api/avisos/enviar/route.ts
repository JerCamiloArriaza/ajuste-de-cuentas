import { obtenerContexto } from "@/lib/avisos/contexto";
import { avisosConfigurados, crearEnviador } from "@/lib/avisos/envio";
import { dentroDelLimite, error, leerJson, responder, tokenValido } from "@/lib/avisos/http";
import { enviarAvisos } from "@/lib/avisos/servicio";

export const dynamic = "force-dynamic";

/**
 * Solo la usa el robot de GitHub, con un token secreto, cuando una ficha es nueva o cambia de estado.
 * Nadie más puede enviar avisos: sin el token responde 401.
 */
export async function POST(request: Request) {
  const ctx = obtenerContexto();
  if (!ctx || !avisosConfigurados()) return error(503, "Los avisos todavía no están activos.");
  if (!(await dentroDelLimite(ctx.limiteAdmin, request))) return error(429, "Demasiados intentos.");
  if (!tokenValido(request.headers.get("authorization"), process.env.PUSH_ADMIN_TOKEN)) return error(401, "No autorizado.");

  const cuerpo = await leerJson(request, 64_000);
  if (cuerpo === undefined) return error(400, "Datos inválidos.");
  const enviar = await crearEnviador();
  if (!enviar) return error(503, "Los avisos todavía no están activos.");
  return responder(await enviarAvisos({ eventos: (cuerpo as { eventos?: unknown }).eventos, almacen: ctx.almacen, enviar }));
}
