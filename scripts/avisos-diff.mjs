// Qué novedades hay entre el último registro de avisos y el estado actual. Función pura, sin red.

/**
 * @param {Record<string, {estado: string, titulo: string}>} anterior  lo ya avisado
 * @param {Record<string, {estado: string, titulo: string}>} actual    lo que hoy se publica
 * @returns {{id: string, titulo: string, estado: string, tipo: "nuevo" | "cambio"}[]}
 *
 * Solo cuentan las fichas nuevas y los cambios de estado. Corregir un texto o una cifra no genera aviso,
 * y que una ficha desaparezca tampoco.
 */
export function calcularEventos(anterior, actual) {
  const eventos = [];
  for (const [id, ficha] of Object.entries(actual)) {
    const antes = anterior[id];
    if (!antes) eventos.push({ id, titulo: ficha.titulo, estado: ficha.estado, tipo: "nuevo" });
    else if (antes.estado !== ficha.estado) eventos.push({ id, titulo: ficha.titulo, estado: ficha.estado, tipo: "cambio" });
  }
  return eventos;
}
