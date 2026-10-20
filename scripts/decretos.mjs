// Lectura de los decretos de modificación presupuestaria que publica Dipres.
// Funciones puras (sin red) para poder probarlas con texto de ejemplo.

/** Frases que identifican un decreto de ajuste fiscal (recorte). Agregar aquí nuevas circulares. */
export const MARCAS_DE_RECORTE = [/Oficio\s+Circular\s+N\W{0,3}\s*12\b/i, /ajuste\s+fiscal/i];

/** Lee la tabla HTML del listado anual de Dipres → [{ numero, fecha, tramitado, url }]. */
export function leerListado(html) {
  const filas = [];
  for (const fila of html.match(/<tr role="row"[\s\S]*?<\/tr>/g) ?? []) {
    const celdas = [...fila.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) =>
      m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    );
    const url = fila.match(/href="([^"]+\.pdf)"/)?.[1];
    if (celdas.length >= 3 && url) {
      filas.push({ numero: celdas[0], fecha: aIso(celdas[1]), tramitado: aIso(celdas[2]), url });
    }
  }
  return filas;
}

/** "24-04-2026" → "2026-04-24" */
export function aIso(fecha) {
  const m = fecha.match(/(\d{2})-(\d{2})-(\d{4})/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : fecha;
}

export function esDecretoDeRecorte(texto) {
  return MARCAS_DE_RECORTE.some((re) => re.test(texto));
}

const NUMERO = /\d{1,3}(?:\.\d{3})+/;

/**
 * Del texto (pdftotext -layout) de un decreto de ajuste, obtiene el organismo cuyo
 * aporte fiscal se reduce y el monto en millones. Devuelve null si no lo encuentra.
 */
export function leerRecorte(texto) {
  const lineas = texto.split(/\r?\n/).map((l) => l.replace(/\s+/g, " ").trim());
  const i = lineas.findIndex((l) => /Programa 05 APORTE FISCAL LIBRE/i.test(l));
  if (i < 0) return null;
  const bloque = lineas.slice(i, i + 25);

  // Si el bloque parte en dólares, el monto en pesos viene después de "Miles de $".
  let desde = 0;
  if (bloque.slice(0, 4).some((l) => l.includes("US$"))) {
    desde = bloque.findIndex((l) => l.includes("Miles de $") && !l.includes("US$"));
    if (desde < 0) return null;
  }

  let monto = null;
  for (const l of bloque.slice(desde)) {
    const n = l.match(NUMERO);
    if (n) {
      monto = Math.round(Number(n[0].replace(/\./g, "")) / 1000);
      break;
    }
  }

  let organismo = null;
  const limpiar = (l) =>
    l.replace(NUMERO, "").replace(/Miles de \$/, "").replace(/^\d+\s+/, "").replace(/\s+\d+$/, "").trim();
  for (let k = 0; k < bloque.length && organismo === null; k++) {
    let nombre = limpiar(bloque[k]);
    if (!/^(MINISTERIO|SERVICIO|PRESIDENCIA|GOBIERNOS|CONGRESO|PODER|CONTRALOR)/.test(nombre)) continue;
    // Nombre cortado en dos líneas ("MINISTERIO DE TRANSPORTES Y" / "TELECOMUNICACIONES").
    const ultima = nombre.split(" ").at(-1).toLowerCase();
    if (nombre.endsWith(",") || MINUSCULAS.has(ultima)) nombre += " " + limpiar(bloque[k + 1] ?? "");
    organismo = nombrePropio(nombre.replace(/[,\s]+$/, ""));
  }

  if (!monto || !organismo) return null;
  return { organismo, montoMillones: monto };
}

const MINUSCULAS = new Set(["de", "del", "la", "las", "el", "los", "y", "e", "a"]);

/** "MINISTERIO DE SALUD" → "Ministerio de Salud" */
export function nombrePropio(texto) {
  return texto
    .toLowerCase()
    .split(" ")
    .map((p, i) => (i > 0 && MINUSCULAS.has(p) ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join(" ");
}

/** Ficha (en el formato de data/) para un decreto de recorte detectado automáticamente. */
export function fichaDeDecreto({ numero, fecha, tramitado, url }, { organismo, montoMillones }) {
  const n = Number(numero);
  const monto = montoMillones.toLocaleString("es-CL");
  const anio = fecha.slice(0, 4);
  return {
    id: `decreto-${n}-${anio}`,
    titulo: `Recorte de $${monto} millones: ${organismo}`,
    resumen: `El Decreto N°${n} de ${anio} del Ministerio de Hacienda reduce en $${monto} millones el aporte fiscal destinado a esta institución: ${organismo}. Detectado automáticamente en el listado de decretos de Dipres; falta revisar a qué programas afecta.`,
    area: "Por clasificar",
    ministerio: organismo,
    tipo: "recorte",
    estado: "aprobado",
    fecha: tramitado,
    montoMillones,
    fuentes: [{ titulo: `Decreto N°${n} de ${anio}, Ministerio de Hacienda (Dipres)`, url, tipo: "oficial" }],
    historial: [
      { fecha, estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: tramitado, estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: false,
    automatico: true,
  };
}
