// Filtro de noticias del robot diario. Funciones puras, sin red, para poder probarlas.
//
// Google Noticias devuelve también medios de otros países (Argentina, Colombia, México, España…)
// aunque se pida Chile. Una noticia solo pasa al informe si:
//   1. viene de un medio chileno (dominio .cl o de la lista de abajo),
//   2. no menciona claramente otro país, y
//   3. su titular habla de una acción concreta (recorte, eliminación, retiro…).

/** Medios chilenos con dominio que no termina en .cl. */
export const MEDIOS_CHILENOS = new Set([
  "latercera.com",
  "emol.com",
  "elciudadano.com",
  "elmostrador.cl",
  "ex-ante.cl",
  "ciperchile.cl",
  "eldinamo.cl",
  "t13.cl",
  "24horas.cl",
  "theclinic.cl",
  "biobiochile.cl",
  "cooperativa.cl",
  "radio.uchile.cl",
  "publimetro.cl",
  "chilevision.cl",
  "meganoticias.cl",
  "cnnchile.com",
  "eldesconcierto.cl",
  "interferencia.cl",
  "elsiglo.cl",
  "df.cl",
  "ciperchile.cl",
]);

/** Si el titular nombra otro país o a sus gobernantes, se descarta. */
const OTRO_PAIS =
  /\b(Argentin[oa]s?|Milei|Kicillof|Colombia(?:no|na)?s?|Petro|De la Espriella|M[eé]xico|mexican[oa]s?|Pemex|Per[uú]|peruan[oa]s?|Costa Rica|tico|Bolivia|Ecuador|Uruguay|Paraguay|Venezuela|Brasil|Lula|Bolsonaro|Espa[nñ]a|PP|Miami|EE\.?\s?UU\.?|Estados Unidos|Trump|Remediar|Honduras|Guatemala|Panam[aá]|Cuba)\b/i;

/** Acciones que interesan a la plataforma. */
const ACCION =
  /(recort|elimin|descontin|posterg|retir[oa]|retira[rn]?|suprim|cierre|cierra|congel|fusi[oó]n|reduc|rebaj|pierde|pierden|sin financ|queda[n]? en \$?0|disminu|menos recursos|ajuste)/i;

function dominio(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

export function esMedioChileno(fuenteUrl) {
  const d = dominio(fuenteUrl);
  if (!d) return false;
  return d.endsWith(".cl") || [...MEDIOS_CHILENOS].some((m) => d === m || d.endsWith("." + m));
}

/** true si la noticia merece que una persona la revise. */
export function esNoticiaRelevante(titulo, fuenteUrl) {
  return esMedioChileno(fuenteUrl) && !OTRO_PAIS.test(titulo) && ACCION.test(titulo);
}

/** Clave para detectar la misma noticia repetida por varios medios o días. */
export function claveTitular(titulo) {
  return titulo
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+[-–|]\s+[^-–|]+$/, "") // quita " - Nombre del medio" del final
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .slice(0, 70);
}
