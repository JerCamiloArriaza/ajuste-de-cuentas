import { crearRedis } from "@/lib/avisos/almacen";
import { avisosConfigurados } from "@/lib/avisos/envio";
import { responder } from "@/lib/avisos/http";

export const dynamic = "force-dynamic";

type EstadoBase = "conectada" | "no-configurada" | "sin-respuesta";

let guardado: { cuando: number; valor: EstadoBase } | null = null;

/** Revisa si la base de datos responde. Se recuerda 5 minutos para no gastar consultas en cada visita. */
async function estadoBase(): Promise<EstadoBase> {
  const redis = crearRedis();
  if (!redis) return "no-configurada";
  if (guardado && Date.now() - guardado.cuando < 300_000) return guardado.valor;
  let valor: EstadoBase = "conectada";
  try {
    await redis.ping();
  } catch {
    valor = "sin-respuesta";
  }
  guardado = { cuando: Date.now(), valor };
  return valor;
}

/**
 * Le dice a la página si los avisos ya están activos, para no mostrar un botón que no funcionaría.
 * Solo informa estados generales (nunca claves ni direcciones).
 */
export async function GET() {
  const baseDeDatos = await estadoBase();
  return responder({ estado: 200, cuerpo: { disponible: baseDeDatos === "conectada" && avisosConfigurados(), baseDeDatos } });
}
