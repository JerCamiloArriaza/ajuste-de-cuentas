/**
 * Solo se enlazan direcciones http(s). Evita que un dato mal formado o manipulado
 * (por ejemplo "javascript:...") se convierta en un enlace peligroso en la ficha.
 */
export function esUrlSegura(url: string): boolean {
  try {
    const { protocol } = new URL(url);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}
