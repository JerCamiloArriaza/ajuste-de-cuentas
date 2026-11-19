export const REPO_URL = "https://github.com/JerCamiloArriaza/ajuste-de-cuentas";

/** Dirección pública del sitio (la fija Vercel con NEXT_PUBLIC_SITE_URL). */
export const SITIO = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ajuste-de-cuentas.vercel.app";

/**
 * Enlace al formulario de correcciones de GitHub, con la ficha ya rellenada.
 * Solo lleva el título y la dirección pública de la ficha: nunca datos personales.
 */
export function enlaceCorreccion(titulo?: string, ruta?: string): string {
  const q = new URLSearchParams({ template: "correccion.yml" });
  if (titulo) q.set("title", `Corrección: ${titulo}`.slice(0, 120));
  if (ruta) q.set("ficha", new URL(ruta, SITIO).href);
  return `${REPO_URL}/issues/new?${q.toString()}`;
}
