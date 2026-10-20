import type { Proyecto } from "@/lib/tipos";

/*
 * Decretos de Hacienda de 2026 que aplican el ajuste fiscal del Oficio Circular N°12
 * (13-03-2026). Montos en millones de pesos, tomados de la sección "Aporte Fiscal Libre"
 * de cada decreto publicado por Dipres. Generado a partir de los PDF oficiales; los
 * marcados `verificado: false` deben revisarse a mano contra el PDF.
 */

const CIRCULAR_12 = {
  titulo: "Oficio Circular N°12 de Hacienda: informa ajuste fiscal (13-03-2026)",
  url: "http://bibliotecadigital.dipres.gob.cl/handle/11626/24126",
  tipo: "oficial",
} as const;

export const DECRETOS_AJUSTE_2026: Proyecto[] = [
  {
    id: "decreto-329-2026",
    titulo: "Recorte de $200.203 millones: Ministerio de Vivienda y Urbanismo",
    resumen:
      "El Decreto N°329 de Hacienda, que aplica el ajuste fiscal del Oficio Circular N°12, reduce en $200.203 millones el aporte fiscal de 2026 para el Ministerio de Vivienda y Urbanismo. Afecta a los Serviu de varias regiones.",
    area: "Vivienda",
    ministerio: "Ministerio de Vivienda y Urbanismo",
    tipo: "recorte",
    estado: "aprobado",
    fecha: "2026-05-12",
    montoMillones: 200203,
    fuentes: [
      { titulo: "Decreto N°329 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0329_TR.pdf", tipo: "oficial" },
      CIRCULAR_12,
    ],
    historial: [
      { fecha: "2026-04-24", estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: "2026-05-12", estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: false,
  },
  {
    id: "decreto-330-2026",
    titulo: "Recorte de $141.144 millones: Ministerio de Trabajo y Previsión Social",
    resumen:
      "El Decreto N°330 de Hacienda, que aplica el ajuste fiscal del Oficio Circular N°12, reduce en $141.144 millones el aporte fiscal de 2026 para el Ministerio de Trabajo y Previsión Social. Afecta a el Instituto de Previsión Social (IPS), la Dirección del Trabajo y Sence, entre otros.",
    area: "Trabajo y previsión",
    ministerio: "Ministerio de Trabajo y Previsión Social",
    tipo: "recorte",
    estado: "aprobado",
    fecha: "2026-05-14",
    montoMillones: 141144,
    fuentes: [
      { titulo: "Decreto N°330 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0330_TR.pdf", tipo: "oficial" },
      CIRCULAR_12,
    ],
    historial: [
      { fecha: "2026-04-24", estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: "2026-05-14", estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: false,
  },
  {
    id: "decreto-331-2026",
    titulo: "Recorte de $32.722 millones: Ministerio de Desarrollo Social y Familia",
    resumen:
      "El Decreto N°331 de Hacienda, que aplica el ajuste fiscal del Oficio Circular N°12, reduce en $32.722 millones el aporte fiscal de 2026 para el Ministerio de Desarrollo Social y Familia. Afecta a el Servicio de Protección Especializada a la Niñez, Conadi, Injuv, Senadis y la Subsecretaría de la Niñez. La prensa informa que incluye $1.850 millones menos para el Programa de Apoyo al Recién Nacido (ajuar). El Gobierno sostiene que el recorte no afecta beneficios directos y se ajusta al gasto real.",
    area: "Niñez y protección social",
    ministerio: "Ministerio de Desarrollo Social y Familia",
    tipo: "recorte",
    estado: "aprobado",
    fecha: "2026-06-11",
    montoMillones: 32722,
    fuentes: [
      { titulo: "Decreto N°331 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0331_TR.pdf", tipo: "oficial" },
      CIRCULAR_12,
      { titulo: "La Tercera – Decreto concreta recorte en Desarrollo Social", url: "https://www.latercera.com/nacional/noticia/decreto-de-hacienda-resuelve-recorte-de-32721-millones-en-desarrollo-social-y-golpea-a-programas-de-ninez-pueblos-indigenas-y-juventud/", tipo: "prensa" },
    ],
    historial: [
      { fecha: "2026-04-24", estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: "2026-06-11", estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: true,
  },
  {
    id: "decreto-332-2026",
    titulo: "Recorte de $21.951 millones: Ministerio de Justicia y Derechos Humanos",
    resumen:
      "El Decreto N°332 de Hacienda, que aplica el ajuste fiscal del Oficio Circular N°12, reduce en $21.951 millones el aporte fiscal de 2026 para el Ministerio de Justicia y Derechos Humanos. Afecta a el Servicio Médico Legal, la Defensoría Penal Pública y el Servicio de Reinserción Social Juvenil, entre otros.",
    area: "Justicia",
    ministerio: "Ministerio de Justicia y Derechos Humanos",
    tipo: "recorte",
    estado: "aprobado",
    fecha: "2026-08-14",
    montoMillones: 21951,
    fuentes: [
      { titulo: "Decreto N°332 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0332_TR.pdf", tipo: "oficial" },
      CIRCULAR_12,
    ],
    historial: [
      { fecha: "2026-04-24", estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: "2026-08-14", estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: false,
  },
  {
    id: "decreto-333-2026",
    titulo: "Recorte de $413.193 millones: Ministerio de Salud",
    resumen:
      "El Decreto N°333 de Hacienda, que aplica el ajuste fiscal del Oficio Circular N°12, reduce en $413.193 millones el aporte fiscal de 2026 para el Ministerio de Salud. Afecta a Fonasa, la Subsecretaría de Redes Asistenciales (hospitales) y el ISP, entre otros. El Minsal afirma que equivale al 1,1% de los recursos operacionales de los hospitales y que no afectará las atenciones; el Colegio Médico lo rechazó.",
    area: "Salud",
    ministerio: "Ministerio de Salud",
    tipo: "recorte",
    estado: "aprobado",
    fecha: "2026-05-13",
    montoMillones: 413193,
    fuentes: [
      { titulo: "Decreto N°333 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0333_TR.pdf", tipo: "oficial" },
      CIRCULAR_12,
      { titulo: "La Tercera – Minsal: recorte no afectará atenciones", url: "https://www.latercera.com/nacional/noticia/minsal-reafirma-que-recorte-de-hacienda-no-afectara-atenciones-representan-solo-un-11-de-los-recursos-operacionales-de-los-hospitales/", tipo: "prensa" },
    ],
    historial: [
      { fecha: "2026-04-24", estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: "2026-05-13", estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: true,
  },
  {
    id: "decreto-334-2026",
    titulo: "Recorte de $5.576 millones: Ministerio de Energía",
    resumen:
      "El Decreto N°334 de Hacienda, que aplica el ajuste fiscal del Oficio Circular N°12, reduce en $5.576 millones el aporte fiscal de 2026 para el Ministerio de Energía. Afecta a la Subsecretaría de Energía, la CNE y la Comisión Chilena de Energía Nuclear.",
    area: "Medioambiente y energía",
    ministerio: "Ministerio de Energía",
    tipo: "recorte",
    estado: "aprobado",
    fecha: "2026-05-14",
    montoMillones: 5576,
    fuentes: [
      { titulo: "Decreto N°334 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0334_TR.pdf", tipo: "oficial" },
      CIRCULAR_12,
    ],
    historial: [
      { fecha: "2026-04-24", estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: "2026-05-14", estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: false,
  },
  {
    id: "decreto-335-2026",
    titulo: "Recorte de $131.188 millones: Ministerio de Obras Públicas",
    resumen:
      "El Decreto N°335 de Hacienda, que aplica el ajuste fiscal del Oficio Circular N°12, reduce en $131.188 millones el aporte fiscal de 2026 para el Ministerio de Obras Públicas. Afecta a principalmente la Dirección General de Obras Públicas.",
    area: "Obras públicas",
    ministerio: "Ministerio de Obras Públicas",
    tipo: "recorte",
    estado: "aprobado",
    fecha: "2026-05-13",
    montoMillones: 131188,
    fuentes: [
      { titulo: "Decreto N°335 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0335_TR.pdf", tipo: "oficial" },
      CIRCULAR_12,
    ],
    historial: [
      { fecha: "2026-04-24", estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: "2026-05-13", estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: false,
  },
  {
    id: "decreto-336-2026",
    titulo: "Recorte de $30.469 millones: Ministerio de Agricultura",
    resumen:
      "El Decreto N°336 de Hacienda, que aplica el ajuste fiscal del Oficio Circular N°12, reduce en $30.469 millones el aporte fiscal de 2026 para el Ministerio de Agricultura. Afecta a Indap, el SAG y otros servicios.",
    area: "Agricultura",
    ministerio: "Ministerio de Agricultura",
    tipo: "recorte",
    estado: "aprobado",
    fecha: "2026-05-14",
    montoMillones: 30469,
    fuentes: [
      { titulo: "Decreto N°336 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0336_TR.pdf", tipo: "oficial" },
      CIRCULAR_12,
    ],
    historial: [
      { fecha: "2026-04-24", estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: "2026-05-14", estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: false,
  },
  {
    id: "decreto-337-2026",
    titulo: "Recorte de $56.162 millones: Ministerio de Transportes y Telecomunicaciones",
    resumen:
      "El Decreto N°337 de Hacienda, que aplica el ajuste fiscal del Oficio Circular N°12, reduce en $56.162 millones el aporte fiscal de 2026 para el Ministerio de Transportes y Telecomunicaciones. Afecta a principalmente la Subsecretaría de Transportes.",
    area: "Transporte",
    ministerio: "Ministerio de Transportes y Telecomunicaciones",
    tipo: "recorte",
    estado: "aprobado",
    fecha: "2026-05-14",
    montoMillones: 56162,
    fuentes: [
      { titulo: "Decreto N°337 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0337_TR.pdf", tipo: "oficial" },
      CIRCULAR_12,
    ],
    historial: [
      { fecha: "2026-04-24", estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: "2026-05-14", estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: false,
  },
  {
    id: "decreto-338-2026",
    titulo: "Recorte de $7.759 millones: Ministerio de Economía, Fomento y Turismo",
    resumen:
      "El Decreto N°338 de Hacienda, que aplica el ajuste fiscal del Oficio Circular N°12, reduce en $7.759 millones el aporte fiscal de 2026 para el Ministerio de Economía, Fomento y Turismo. Afecta a Sernac, Pesca, INE, Sernatur y otros servicios.",
    area: "Economía",
    ministerio: "Ministerio de Economía, Fomento y Turismo",
    tipo: "recorte",
    estado: "aprobado",
    fecha: "2026-05-14",
    montoMillones: 7759,
    fuentes: [
      { titulo: "Decreto N°338 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0338_TR.pdf", tipo: "oficial" },
      CIRCULAR_12,
    ],
    historial: [
      { fecha: "2026-04-24", estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: "2026-05-14", estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: false,
  },
  {
    id: "decreto-339-2026",
    titulo: "Recorte de $17.664 millones: Ministerio de Ciencia, Tecnología, Conocimiento e Innovación",
    resumen:
      "El Decreto N°339 de Hacienda, que aplica el ajuste fiscal del Oficio Circular N°12, reduce en $17.664 millones el aporte fiscal de 2026 para el Ministerio de Ciencia, Tecnología, Conocimiento e Innovación. Afecta a la Subsecretaría de Ciencia y la ANID.",
    area: "Ciencia",
    ministerio: "Ministerio de Ciencia, Tecnología, Conocimiento e Innovación",
    tipo: "recorte",
    estado: "aprobado",
    fecha: "2026-06-30",
    montoMillones: 17664,
    fuentes: [
      { titulo: "Decreto N°339 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0339_TR.pdf", tipo: "oficial" },
      CIRCULAR_12,
    ],
    historial: [
      { fecha: "2026-04-24", estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: "2026-06-30", estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: false,
  },
  {
    id: "decreto-340-2026",
    titulo: "Recorte de $1.634 millones: Ministerio de Relaciones Exteriores",
    resumen:
      "El Decreto N°340 de Hacienda, que aplica el ajuste fiscal del Oficio Circular N°12, reduce en $1.634 millones el aporte fiscal de 2026 para el Ministerio de Relaciones Exteriores. Afecta a varios servicios (además de US$7,9 millones en moneda extranjera).",
    area: "Otra",
    ministerio: "Ministerio de Relaciones Exteriores",
    tipo: "recorte",
    estado: "aprobado",
    fecha: "2026-05-12",
    montoMillones: 1634,
    fuentes: [
      { titulo: "Decreto N°340 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0340_TR.pdf", tipo: "oficial" },
      CIRCULAR_12,
    ],
    historial: [
      { fecha: "2026-04-24", estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: "2026-05-12", estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: false,
  },
  {
    id: "decreto-341-2026",
    titulo: "Recorte de $994 millones: Ministerio Secretaría General de Gobierno",
    resumen:
      "El Decreto N°341 de Hacienda, que aplica el ajuste fiscal del Oficio Circular N°12, reduce en $994 millones el aporte fiscal de 2026 para el Ministerio Secretaría General de Gobierno. Afecta a la Segegob y el Consejo Nacional de Televisión.",
    area: "Otra",
    ministerio: "Ministerio Secretaría General de Gobierno",
    tipo: "recorte",
    estado: "aprobado",
    fecha: "2026-05-14",
    montoMillones: 994,
    fuentes: [
      { titulo: "Decreto N°341 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0341_TR.pdf", tipo: "oficial" },
      CIRCULAR_12,
    ],
    historial: [
      { fecha: "2026-04-24", estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: "2026-05-14", estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: false,
  },
  {
    id: "decreto-342-2026",
    titulo: "Recorte de $707 millones: Presidencia de la República",
    resumen:
      "El Decreto N°342 de Hacienda, que aplica el ajuste fiscal del Oficio Circular N°12, reduce en $707 millones el aporte fiscal de 2026 para la Presidencia de la República. Afecta a gastos en personal de la Presidencia.",
    area: "Otra",
    ministerio: "Presidencia de la República",
    tipo: "recorte",
    estado: "aprobado",
    fecha: "2026-05-12",
    montoMillones: 707,
    fuentes: [
      { titulo: "Decreto N°342 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0342_TR.pdf", tipo: "oficial" },
      CIRCULAR_12,
    ],
    historial: [
      { fecha: "2026-04-24", estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: "2026-05-12", estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: false,
  },
  {
    id: "decreto-343-2026",
    titulo: "Recorte de $2.742 millones: Ministerio de la Mujer y Equidad de Género",
    resumen:
      "El Decreto N°343 de Hacienda, que aplica el ajuste fiscal del Oficio Circular N°12, reduce en $2.742 millones el aporte fiscal de 2026 para el Ministerio de la Mujer y Equidad de Género. Afecta a la Subsecretaría y el SernamEG.",
    area: "Mujer y género",
    ministerio: "Ministerio de la Mujer y Equidad de Género",
    tipo: "recorte",
    estado: "aprobado",
    fecha: "2026-05-13",
    montoMillones: 2742,
    fuentes: [
      { titulo: "Decreto N°343 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0343_TR.pdf", tipo: "oficial" },
      CIRCULAR_12,
    ],
    historial: [
      { fecha: "2026-04-24", estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: "2026-05-13", estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: false,
  },
  {
    id: "decreto-344-2026",
    titulo: "Recorte de $5.743 millones: Ministerio del Deporte",
    resumen:
      "El Decreto N°344 de Hacienda, que aplica el ajuste fiscal del Oficio Circular N°12, reduce en $5.743 millones el aporte fiscal de 2026 para el Ministerio del Deporte. Afecta a principalmente el Instituto Nacional de Deportes.",
    area: "Deporte",
    ministerio: "Ministerio del Deporte",
    tipo: "recorte",
    estado: "aprobado",
    fecha: "2026-05-12",
    montoMillones: 5743,
    fuentes: [
      { titulo: "Decreto N°344 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0344_TR.pdf", tipo: "oficial" },
      CIRCULAR_12,
    ],
    historial: [
      { fecha: "2026-04-24", estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: "2026-05-12", estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: false,
  },
  {
    id: "decreto-345-2026",
    titulo: "Recorte de $372 millones: Ministerio Secretaría General de la Presidencia",
    resumen:
      "El Decreto N°345 de Hacienda, que aplica el ajuste fiscal del Oficio Circular N°12, reduce en $372 millones el aporte fiscal de 2026 para el Ministerio Secretaría General de la Presidencia. Afecta a la Segpres.",
    area: "Otra",
    ministerio: "Ministerio Secretaría General de la Presidencia",
    tipo: "recorte",
    estado: "aprobado",
    fecha: "2026-05-12",
    montoMillones: 372,
    fuentes: [
      { titulo: "Decreto N°345 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0345_TR.pdf", tipo: "oficial" },
      CIRCULAR_12,
    ],
    historial: [
      { fecha: "2026-04-24", estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: "2026-05-12", estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: false,
  },
  {
    id: "decreto-346-2026",
    titulo: "Recorte de $1.643 millones: Ministerio de Minería",
    resumen:
      "El Decreto N°346 de Hacienda, que aplica el ajuste fiscal del Oficio Circular N°12, reduce en $1.643 millones el aporte fiscal de 2026 para el Ministerio de Minería. Afecta a Cochilco y Sernageomin.",
    area: "Otra",
    ministerio: "Ministerio de Minería",
    tipo: "recorte",
    estado: "aprobado",
    fecha: "2026-05-12",
    montoMillones: 1643,
    fuentes: [
      { titulo: "Decreto N°346 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0346_TR.pdf", tipo: "oficial" },
      CIRCULAR_12,
    ],
    historial: [
      { fecha: "2026-04-24", estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: "2026-05-12", estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: false,
  },
  {
    id: "decreto-347-2026",
    titulo: "Recorte de $2.898 millones: Ministerio del Medio Ambiente",
    resumen:
      "El Decreto N°347 de Hacienda, que aplica el ajuste fiscal del Oficio Circular N°12, reduce en $2.898 millones el aporte fiscal de 2026 para el Ministerio del Medio Ambiente. Afecta a el SEA, la Superintendencia del Medio Ambiente y el Servicio de Biodiversidad y Áreas Protegidas.",
    area: "Medioambiente y energía",
    ministerio: "Ministerio del Medio Ambiente",
    tipo: "recorte",
    estado: "aprobado",
    fecha: "2026-05-14",
    montoMillones: 2898,
    fuentes: [
      { titulo: "Decreto N°347 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0347_TR.pdf", tipo: "oficial" },
      CIRCULAR_12,
    ],
    historial: [
      { fecha: "2026-04-24", estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: "2026-05-14", estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: false,
  },
  {
    id: "decreto-349-2026",
    titulo: "Recorte de $1.173 millones: Servicio Electoral",
    resumen:
      "El Decreto N°349 de Hacienda, que aplica el ajuste fiscal del Oficio Circular N°12, reduce en $1.173 millones el aporte fiscal de 2026 para el Servicio Electoral. Afecta a gastos en personal del Servel.",
    area: "Otra",
    ministerio: "Servicio Electoral",
    tipo: "recorte",
    estado: "aprobado",
    fecha: "2026-05-14",
    montoMillones: 1173,
    fuentes: [
      { titulo: "Decreto N°349 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0349_TR.pdf", tipo: "oficial" },
      CIRCULAR_12,
    ],
    historial: [
      { fecha: "2026-04-24", estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: "2026-05-14", estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: false,
  },
  {
    id: "decreto-350-2026",
    titulo: "Recorte de $150.379 millones: Tesoro Público (subsidios y prestaciones)",
    resumen:
      "El Decreto N°350 de Hacienda, que aplica el ajuste fiscal del Oficio Circular N°12, reduce en $150.379 millones el aporte fiscal de 2026 para el Tesoro Público (subsidios y prestaciones). Afecta a subsidios y prestaciones administrados por el Tesoro Público, como el Fondo Único de Prestaciones Familiares y Subsidios de Cesantía.",
    area: "Trabajo y previsión",
    ministerio: "Tesoro Público (subsidios y prestaciones)",
    tipo: "recorte",
    estado: "aprobado",
    fecha: "2026-05-14",
    montoMillones: 150379,
    fuentes: [
      { titulo: "Decreto N°350 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0350_TR.pdf", tipo: "oficial" },
      CIRCULAR_12,
    ],
    historial: [
      { fecha: "2026-04-24", estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: "2026-05-14", estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: false,
  },
  {
    id: "decreto-351-2026",
    titulo: "Recorte de $51.750 millones: Ministerio de las Culturas, las Artes y el Patrimonio",
    resumen:
      "El Decreto N°351 de Hacienda, que aplica el ajuste fiscal del Oficio Circular N°12, reduce en $51.750 millones el aporte fiscal de 2026 para el Ministerio de las Culturas, las Artes y el Patrimonio. Afecta a la Subsecretaría de las Culturas y las Artes y el Servicio Nacional del Patrimonio.",
    area: "Cultura",
    ministerio: "Ministerio de las Culturas, las Artes y el Patrimonio",
    tipo: "recorte",
    estado: "aprobado",
    fecha: "2026-05-14",
    montoMillones: 51750,
    fuentes: [
      { titulo: "Decreto N°351 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0351_TR.pdf", tipo: "oficial" },
      CIRCULAR_12,
    ],
    historial: [
      { fecha: "2026-04-24", estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: "2026-05-14", estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: false,
  },
  {
    id: "decreto-371-2026",
    titulo: "Recorte de $20.059 millones: Ministerio del Interior y Seguridad Pública",
    resumen:
      "El Decreto N°371 de Hacienda, que aplica el ajuste fiscal del Oficio Circular N°12, reduce en $20.059 millones el aporte fiscal de 2026 para el Ministerio del Interior y Seguridad Pública. Afecta a Senapred, Subdere, Senda, Migraciones y otros servicios.",
    area: "Otra",
    ministerio: "Ministerio del Interior y Seguridad Pública",
    tipo: "recorte",
    estado: "aprobado",
    fecha: "2026-07-20",
    montoMillones: 20059,
    fuentes: [
      { titulo: "Decreto N°371 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0371_TR.pdf", tipo: "oficial" },
      CIRCULAR_12,
    ],
    historial: [
      { fecha: "2026-05-12", estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: "2026-07-20", estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: false,
  },
  {
    id: "decreto-372-2026",
    titulo: "Recorte de $21.930 millones: Ministerio de Hacienda",
    resumen:
      "El Decreto N°372 de Hacienda, que aplica el ajuste fiscal del Oficio Circular N°12, reduce en $21.930 millones el aporte fiscal de 2026 para el Ministerio de Hacienda. Afecta a SII, Aduanas, Tesorería, ChileCompra y otros servicios.",
    area: "Otra",
    ministerio: "Ministerio de Hacienda",
    tipo: "recorte",
    estado: "aprobado",
    fecha: "2026-06-02",
    montoMillones: 21930,
    fuentes: [
      { titulo: "Decreto N°372 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0372_TR.pdf", tipo: "oficial" },
      CIRCULAR_12,
    ],
    historial: [
      { fecha: "2026-05-12", estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: "2026-06-02", estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: false,
  },
  {
    id: "decreto-373-2026",
    titulo: "Recorte de $1.137 millones: Ministerio de Bienes Nacionales",
    resumen:
      "El Decreto N°373 de Hacienda, que aplica el ajuste fiscal del Oficio Circular N°12, reduce en $1.137 millones el aporte fiscal de 2026 para el Ministerio de Bienes Nacionales. Afecta a compras de terrenos de Bienes Nacionales.",
    area: "Otra",
    ministerio: "Ministerio de Bienes Nacionales",
    tipo: "recorte",
    estado: "aprobado",
    fecha: "2026-05-29",
    montoMillones: 1137,
    fuentes: [
      { titulo: "Decreto N°373 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0373_TR.pdf", tipo: "oficial" },
      CIRCULAR_12,
    ],
    historial: [
      { fecha: "2026-05-12", estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: "2026-05-29", estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: false,
  },
  {
    id: "decreto-374-2026",
    titulo: "Recorte de $3.281 millones: Gobiernos Regionales",
    resumen:
      "El Decreto N°374 de Hacienda, que aplica el ajuste fiscal del Oficio Circular N°12, reduce en $3.281 millones el aporte fiscal de 2026 para los Gobiernos Regionales. Afecta a aportes a gobiernos regionales.",
    area: "Regiones",
    ministerio: "Gobiernos Regionales",
    tipo: "recorte",
    estado: "aprobado",
    fecha: "2026-05-25",
    montoMillones: 3281,
    fuentes: [
      { titulo: "Decreto N°374 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0374_TR.pdf", tipo: "oficial" },
      CIRCULAR_12,
    ],
    historial: [
      { fecha: "2026-05-12", estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: "2026-05-25", estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: false,
  },
  {
    id: "decreto-394-2026",
    titulo: "Recorte de $75.473 millones: Ministerio de Educación",
    resumen:
      "El Decreto N°394 de Hacienda, que aplica el ajuste fiscal del Oficio Circular N°12, reduce en $75.473 millones el aporte fiscal de 2026 para el Ministerio de Educación. Afecta a la Subsecretaría de Educación, Junaeb, Junji, la Agencia de Calidad y otros servicios.",
    area: "Educación",
    ministerio: "Ministerio de Educación",
    tipo: "recorte",
    estado: "aprobado",
    fecha: "2026-06-08",
    montoMillones: 75473,
    fuentes: [
      { titulo: "Decreto N°394 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0394_TR.pdf", tipo: "oficial" },
      CIRCULAR_12,
    ],
    historial: [
      { fecha: "2026-05-20", estado: "en_proceso", nota: "Hacienda firma el decreto y lo envía a Contraloría." },
      { fecha: "2026-06-08", estado: "aprobado", nota: "Contraloría toma razón; el recorte queda vigente." },
    ],
    verificado: false,
  },
];
