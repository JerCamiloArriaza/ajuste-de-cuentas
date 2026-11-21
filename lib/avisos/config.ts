/** Clave pública que identifica a este servidor ante los servicios de avisos (VAPID). Es pública por diseño. */
export const CLAVE_PUBLICA_VAPID =
  "BJODYd7XVMzrWMA4EpnCAfA5UbIgCFBiWWyFiJ_KeGlk0VRPeJiZGxsiC918oNl-CTKfUayutoE7vx_pv-PnKtk";

/** Tope de celulares suscritos: evita que alguien infle la base de datos con suscripciones falsas. */
export const MAX_SUSCRIPCIONES = 20_000;

/** Máximo de novedades que se aceptan en un solo envío. */
export const MAX_EVENTOS_POR_ENVIO = 100;

/** Cuánto se guarda una suscripción sin renovarse (días). */
export const DIAS_DE_VIDA = 400;

/**
 * Servicios de avisos que usan los navegadores (Chrome/Android, Firefox, Safari/iPhone, Edge).
 * El servidor envía mensajes a la dirección que entrega cada celular; si no se limitara a estos
 * servicios, alguien podría hacer que el servidor consulte cualquier sitio (ataque SSRF).
 * Una entrada que empieza con "." acepta cualquier subdominio.
 */
export const SERVICIOS_DE_AVISOS = [
  "fcm.googleapis.com",
  "updates.push.services.mozilla.com",
  ".push.services.mozilla.com",
  "web.push.apple.com",
  ".push.apple.com",
  ".notify.windows.com",
] as const;
