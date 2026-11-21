import { SITIO } from "@/lib/sitio";
import { CLAVE_PUBLICA_VAPID } from "./config";
import type { Enviador } from "./servicio";

/** true si falta alguna variable y los avisos no pueden funcionar todavía. */
export function avisosConfigurados(): boolean {
  return Boolean(process.env.VAPID_PRIVATE_KEY && process.env.PUSH_ADMIN_TOKEN);
}

/** Envía un aviso de verdad a través del servicio del navegador (Google, Apple, Mozilla…). */
export async function crearEnviador(): Promise<Enviador | null> {
  const privada = process.env.VAPID_PRIVATE_KEY;
  if (!privada) return null;
  const webpush = (await import("web-push")).default;
  webpush.setVapidDetails(SITIO, CLAVE_PUBLICA_VAPID, privada);
  return async (sub, aviso) => {
    try {
      await webpush.sendNotification(sub, JSON.stringify(aviso), { TTL: 86_400, urgency: "normal", timeout: 10_000 });
      return { ok: true, caducada: false };
    } catch (e) {
      const codigo = (e as { statusCode?: number }).statusCode;
      // 404/410: el celular canceló o la suscripción venció; hay que borrarla.
      return { ok: false, caducada: codigo === 404 || codigo === 410 };
    }
  };
}
