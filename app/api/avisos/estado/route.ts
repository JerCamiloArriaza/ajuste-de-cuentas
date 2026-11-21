import { obtenerContexto } from "@/lib/avisos/contexto";
import { avisosConfigurados } from "@/lib/avisos/envio";
import { responder } from "@/lib/avisos/http";

export const dynamic = "force-dynamic";

/** Le dice a la página si los avisos ya están activos, para no mostrar un botón que no funcionaría. */
export async function GET() {
  return responder({ estado: 200, cuerpo: { disponible: Boolean(obtenerContexto()) && avisosConfigurados() } });
}
