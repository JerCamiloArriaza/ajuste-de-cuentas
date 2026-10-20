import type { Proyecto } from "@/lib/tipos";
import automaticos from "./automaticos.json";
import { DECRETOS_AJUSTE_2026 } from "./decretos-ajuste-2026";

/*
 * AQUÍ SE AGREGAN LOS CAMBIOS DEL GOBIERNO.
 *
 * Reglas:
 *  - Cada registro necesita al menos una fuente con tipo "oficial"
 *    (Diario Oficial, Dipres, Cámara, Senado, Contraloría, ministerio).
 *    Si no la tiene, NO aparece en la app.
 *  - "fecha" es la fecha del último cambio de estado (AAAA-MM-DD).
 *  - Al cambiar de estado, actualiza "estado" y "fecha" y agrega una línea en "historial".
 *  - `verificado: false` muestra el aviso "Por verificar". Pásalo a `true` solo
 *    cuando hayas confirmado la cifra en el documento oficial (la partida
 *    respectiva del proyecto o ley de presupuestos, el decreto, etc.).
 */

const DIPRES_PRESUPUESTO_2027 = {
  titulo: "Dipres – Documentos del Proyecto de Ley de Presupuestos 2027",
  url: "https://www.dipres.gob.cl/597/w3-multipropertyvalues-15199-38403.html",
  tipo: "oficial",
} as const;

const DIPRES_OFERTA_2027 = {
  titulo: "Dipres – Informe Oferta Programática 2027 (6-10-2026)",
  url: "https://www.dipres.gob.cl/597/articles-433302_doc_pdf.pdf",
  tipo: "oficial",
} as const;

const INGRESO_CONGRESO = {
  fecha: "2026-09-30",
  estado: "en_proceso",
  nota: "El Gobierno ingresa el proyecto de Presupuestos 2027 al Congreso. Debe despacharse antes del 30 de noviembre.",
} as const;

export const PROYECTOS: Proyecto[] = [
  {
    id: "presupuesto-2027-yo-elijo-mi-pc",
    titulo: "Fin del programa “Yo Elijo mi PC” (notebooks para estudiantes)",
    resumen:
      "El proyecto de Presupuestos 2027 no incluye la asignación de Junaeb que financia la entrega de computadores a estudiantes de 7° básico. En 2026 esa asignación era de unos $34.796 millones. No se identifica una partida equivalente que la reemplace.",
    area: "Educación",
    ministerio: "Ministerio de Educación",
    tipo: "eliminacion",
    montoMillones: 34796,
    estado: "en_proceso",
    fecha: "2026-09-30",
    fuentes: [
      DIPRES_PRESUPUESTO_2027,
      {
        titulo: "BioBioChile – “Yo elijo mi PC” llega a su fin (1-10-2026)",
        url: "https://www.biobiochile.cl/noticias/nacional/chile/2026/10/01/yo-elijo-mi-pc-llega-a-su-fin-presupuesto-2027-de-kast-corta-entrega-de-notebooks-para-estudiantes.shtml",
        tipo: "prensa",
      },
    ],
    historial: [INGRESO_CONGRESO],
    verificado: false,
  },
  {
    id: "presupuesto-2027-energia-siete-programas",
    titulo: "Siete programas del Ministerio de Energía dejan de financiarse",
    resumen:
      "Según la prensa, el proyecto de Presupuestos 2027 descontinúa siete programas de Energía, varios orientados a comunidades rurales y aisladas. Dipres señala que los ajustes se concentran en programas con malos resultados en sus evaluaciones.",
    area: "Medioambiente y energía",
    ministerio: "Ministerio de Energía",
    tipo: "eliminacion",
    estado: "en_proceso",
    fecha: "2026-09-30",
    fuentes: [
      DIPRES_OFERTA_2027,
      {
        titulo: "El Desconcierto – Gobierno suprime siete programas de Energía",
        url: "https://eldesconcierto.cl/hoja-ruta/presupuesto-2027-gobierno-kast-suprime-siete-programas-energia-afectando-comunidades-rurales-y-aisladas-n5462765",
        tipo: "prensa",
      },
    ],
    historial: [INGRESO_CONGRESO],
    verificado: false,
  },
  {
    id: "presupuesto-2027-liceos-bicentenario",
    titulo: "Recorte de 46,7% a Liceos Bicentenario",
    resumen:
      "El proyecto de Presupuestos 2027 reduce en 46,7% el financiamiento del programa Liceos Bicentenario de Excelencia, según la prensa.",
    area: "Educación",
    ministerio: "Ministerio de Educación",
    tipo: "recorte",
    estado: "en_proceso",
    fecha: "2026-09-30",
    fuentes: [
      DIPRES_OFERTA_2027,
      {
        titulo: "Sabes.cl – Los programas con mayores recortes en el Presupuesto 2027",
        url: "https://sabes.cl/2026/10/06/presupuesto-2027-los-programas-que-tendran-mayores-recortes-los-que-quedan-en-0-y-las-areas-que-recibiran-mas-recursos",
        tipo: "prensa",
      },
    ],
    historial: [INGRESO_CONGRESO],
    verificado: false,
  },
  {
    id: "presupuesto-2027-tenencia-responsable-mascotas",
    titulo: "Programa de Tenencia Responsable de Mascotas (Ley Cholito) cae 86%",
    resumen:
      "El programa pasaría de $3.634 millones en 2026 a $514 millones en 2027, según la prensa.",
    area: "Otra",
    ministerio: "Ministerio del Interior y Seguridad Pública",
    tipo: "recorte",
    montoMillones: 3120,
    estado: "en_proceso",
    fecha: "2026-09-30",
    fuentes: [
      DIPRES_OFERTA_2027,
      {
        titulo: "Sabes.cl – Los programas con mayores recortes en el Presupuesto 2027",
        url: "https://sabes.cl/2026/10/06/presupuesto-2027-los-programas-que-tendran-mayores-recortes-los-que-quedan-en-0-y-las-areas-que-recibiran-mas-recursos",
        tipo: "prensa",
      },
    ],
    historial: [INGRESO_CONGRESO],
    verificado: false,
  },
  {
    id: "presupuesto-2027-becas-chile",
    titulo: "Becas Chile: $1.907 millones menos y fin de los cursos de idiomas",
    resumen:
      "El proyecto asigna $21.810 millones a Becas Chile, frente a $23.717 millones en 2026. Además elimina la asignación de Cursos de Idiomas de Becas Chile. El presupuesto del Ministerio de Ciencia baja 7,4%.",
    area: "Ciencia",
    ministerio: "Ministerio de Ciencia, Tecnología, Conocimiento e Innovación",
    tipo: "recorte",
    montoMillones: 1907,
    estado: "en_proceso",
    fecha: "2026-09-30",
    fuentes: [
      DIPRES_PRESUPUESTO_2027,
      {
        titulo: "CNN Chile – Casi $2.000 millones menos para Becas Chile",
        url: "https://www.cnnchile.com/pais/presupuesto-2027-recorte-ciencia-becas-chile-fondequip/",
        tipo: "prensa",
      },
      {
        titulo: "Radio U. de Chile – Presupuesto 2027 reduce 7,4% al Ministerio de Ciencia",
        url: "https://radio.uchile.cl/2026/10/06/presupuesto-2027-reduce-en-74-los-recursos-del-ministerio-de-ciencia/",
        tipo: "prensa",
      },
    ],
    historial: [INGRESO_CONGRESO],
    verificado: false,
  },
  {
    id: "presupuesto-2027-programas-salud-trans",
    titulo: "Programas de identidad de género y salud trans sin asignación explícita",
    resumen:
      "El proyecto de Presupuestos 2027 no contempla una asignación específica para el Programa de Acompañamiento a la Identidad de Género (PAIG) ni para el Programa de Salud Trans. El Movilh pidió al Gobierno aclarar si eso significa que quedan sin recursos. Que no haya asignación explícita no prueba por sí solo que el programa se elimine.",
    area: "Salud",
    ministerio: "Ministerio de Salud",
    tipo: "reformulacion",
    estado: "en_proceso",
    fecha: "2026-09-30",
    fuentes: [
      DIPRES_PRESUPUESTO_2027,
      {
        titulo: "Movilh – Presupuesto 2027 sin financiamiento explícito para programas trans",
        url: "https://www.movilh.cl/kast-elimina-financiamiento-explicito-a-programas-para-personas-trans-en-el-presupuesto-2027/",
        tipo: "prensa",
      },
    ],
    historial: [INGRESO_CONGRESO],
    verificado: false,
  },
  {
    id: "presupuesto-2027-programas-con-malas-evaluaciones",
    titulo: "Recorte promedio de 18% a 144 programas con malas evaluaciones",
    resumen:
      "Según Dipres, 144 programas con hallazgos negativos en sus evaluaciones reducen en promedio 18% sus recursos en 2027. Los programas reformulados que fueron objetados técnicamente bajan 35%. Dipres también reconoce ajustes en programas sin hallazgos, por la estrechez fiscal. La prensa informa que, de 22 programas objetados, tres quedan sin financiamiento: en Energía, Conadi y Segegob.",
    area: "Varias",
    ministerio: "Ministerio de Hacienda (Dipres)",
    tipo: "recorte",
    estado: "en_proceso",
    fecha: "2026-09-30",
    fuentes: [
      {
        titulo: "Dipres – Análisis integrado, Oferta Programática 2027 (6-10-2026)",
        url: "https://www.dipres.gob.cl/597/articles-433301_doc_pdf.pdf",
        tipo: "oficial",
      },
      DIPRES_OFERTA_2027,
      {
        titulo: "The Clinic – De 22 programas objetados, tres fueron eliminados",
        url: "https://www.theclinic.cl/2026/10/06/presupuestos-2027-de-22-programas-objetados-en-las-evaluaciones-tres-fueron-eliminados-y-el-resto-sufrio-reduccion-de-recursos/",
        tipo: "prensa",
      },
    ],
    historial: [INGRESO_CONGRESO],
    verificado: false,
  },
  {
    id: "presupuesto-2027-universidad-de-chile",
    titulo: "Universidad de Chile: 19,4% menos para Actividades de Interés Nacional y PAES",
    resumen:
      "El proyecto de Presupuestos 2027 reduce en 19,4% real la asignación de Actividades de Interés Nacional de la Universidad de Chile, que también financia la aplicación de la PAES, según la prensa.",
    area: "Educación",
    ministerio: "Ministerio de Educación",
    tipo: "recorte",
    estado: "en_proceso",
    fecha: "2026-09-30",
    fuentes: [
      DIPRES_PRESUPUESTO_2027,
      {
        titulo: "El Mostrador – Presupuesto 2027 recorta fondos a la U. de Chile para PAES",
        url: "https://www.elmostrador.cl/noticias/pais/2026/10/07/presupuesto-2027-recorta-fondos-a-la-u-de-chile-para-paes-y-programas-de-interes-nacional/",
        tipo: "prensa",
      },
    ],
    historial: [INGRESO_CONGRESO],
    verificado: false,
  },
  {
    id: "oficio-hacienda-descontinuar-142-programas",
    titulo: "Hacienda pide a los ministerios evaluar descontinuar 142 programas",
    resumen:
      "En abril, un oficio de Hacienda para preparar el Presupuesto 2027 recomendó descontinuar 142 programas de 22 ministerios, con un costo anual cercano a $5,4 billones, y rebajar otros 260. El ministro Quiroz dijo que no era una decisión de cerrar programas, sino una recomendación. Lo que finalmente se recorta aparece en las fichas del Presupuesto 2027.",
    area: "Varias",
    ministerio: "Ministerio de Hacienda",
    tipo: "eliminacion",
    estado: "en_proceso",
    fecha: "2026-04-21",
    fuentes: [
      {
        titulo: "Dipres – Oficio Circular N°16: formulación del Presupuesto 2027",
        url: "http://bibliotecadigital.dipres.gob.cl/handle/11626/24164",
        tipo: "oficial",
      },
      {
        titulo: "The Clinic – Descontinuar 142 programas y rebajar otros 260",
        url: "https://www.theclinic.cl/2026/04/24/descontinuar-142-programas-y-rebajar-presupuesto-en-otros-260-las-recomendaciones-de-hacienda-a-ministerios-para-recortar-mas-de-6-mil-millones-de-dolares/",
        tipo: "prensa",
      },
      {
        titulo: "Emol – Los ministerios afectados y las explicaciones de Quiroz",
        url: "https://www.emol.com/noticias/Economia/2026/04/25/1198242/oficios-hacienda-recorte-presupuesto.html",
        tipo: "prensa",
      },
    ],
    historial: [{ fecha: "2026-04-21", estado: "en_proceso", nota: "Oficio de Hacienda a los ministerios." }],
    verificado: false,
  },
  {
    id: "retiro-proyecto-negociacion-ramal",
    titulo: "Retiro del proyecto de negociación colectiva ramal (multinivel)",
    resumen:
      "El Gobierno retiró del Congreso el proyecto que permitía negociar colectivamente por sector o rama de la economía, ingresado en enero de 2026 por el gobierno anterior. El Presidente dijo que no es urgente y que la prioridad es el empleo. La CUT y la oposición lo criticaron.",
    area: "Trabajo y previsión",
    ministerio: "Ministerio del Trabajo y Previsión Social",
    tipo: "retiro",
    estado: "eliminado",
    fecha: "2026-03-17",
    fuentes: [
      {
        titulo: "Senado – Tramitación del boletín 18044-13 (estado: Retirado)",
        url: "https://tramitacion.senado.cl/appsenado/templates/tramitacion/index.php?boletin_ini=18044",
        tipo: "oficial",
      },
      {
        titulo: "Emol – Kast retira del Congreso el proyecto de negociación ramal",
        url: "https://www.emol.com/noticias/Economia/2026/03/17/1194511/negociacion-ramal-kast-retira.html",
        tipo: "prensa",
      },
    ],
    historial: [
      { fecha: "2026-01-09", estado: "en_proceso", nota: "Ingreso al Congreso (gobierno anterior)." },
      { fecha: "2026-03-17", estado: "eliminado", nota: "El Ejecutivo retira el proyecto mediante oficio a la Cámara." },
    ],
    verificado: true,
  },
  {
    id: "retiro-nueva-ley-de-pesca",
    titulo: "Retiro del proyecto de nueva Ley General de Pesca",
    resumen:
      "El Gobierno retiró el proyecto que reemplazaba la actual Ley de Pesca (“Ley Longueira”). Llevaba dos años en el Congreso y tenía votados en comisión 11 de sus 12 títulos. El Ejecutivo anunció que en su lugar propondrá modificar la ley vigente. Parlamentarios de oposición y del Senado criticaron la decisión.",
    area: "Economía",
    ministerio: "Ministerio de Economía, Fomento y Turismo",
    tipo: "retiro",
    estado: "postergado",
    fecha: "2026-03-26",
    fuentes: [
      {
        titulo: "Senado – Tramitación del boletín 16500-21 (estado: Retirado)",
        url: "https://tramitacion.senado.cl/appsenado/templates/tramitacion/index.php?boletin_ini=16500",
        tipo: "oficial",
      },
      {
        titulo: "El Dínamo – Las razones del Gobierno para retirar el proyecto de pesca",
        url: "https://www.eldinamo.cl/politica/2026/03/26/ley-longueira-sigue-vigente-las-razones-del-gobierno-para-retirar-del-congreso-el-nuevo-proyecto-de-pesca/",
        tipo: "prensa",
      },
    ],
    historial: [
      { fecha: "2024-01-02", estado: "en_proceso", nota: "Ingreso al Congreso (gobierno anterior)." },
      { fecha: "2026-03-26", estado: "postergado", nota: "El Ejecutivo retira el proyecto y anuncia que reformará la ley vigente." },
    ],
    verificado: true,
  },
  {
    id: "retiro-43-decretos-ambientales",
    titulo: "Retiro de 43 decretos ambientales en trámite en Contraloría",
    resumen:
      "El Ministerio del Medio Ambiente retiró de Contraloría 43 decretos pendientes. Entre ellos estaban la creación de parques nacionales (como Salar de Gorbea y Mar de Juan Fernández), planes de descontaminación y la protección de especies como el pingüino de Humboldt. El Gobierno dice que se trata de una revisión y que podrán reingresarse; uno ya volvió a ingresar. La oposición lo criticó.",
    area: "Medioambiente y energía",
    ministerio: "Ministerio del Medio Ambiente",
    tipo: "retiro",
    estado: "postergado",
    fecha: "2026-03-12",
    fuentes: [
      {
        titulo: "Cámara de Diputadas y Diputados – El Ejecutivo presenta su hoja de ruta ambiental",
        url: "https://www.camara.cl/cms/2026/03/25/ejecutivo-presento-hoja-de-ruta-en-materia-medioambiental/",
        tipo: "oficial",
      },
      {
        titulo: "Emol – Se retiran 43 decretos medioambientales",
        url: "https://www.emol.com/noticias/Nacional/2026/03/17/1194556/se-retiran-43-decretos-medioambientales.html",
        tipo: "prensa",
      },
      {
        titulo: "Mongabay – Kast frena áreas protegidas y otras normas ambientales",
        url: "https://es.mongabay.com/2026/03/chile-kast-frena-areas-protegidas-salares-normas-ambientales-boric/",
        tipo: "prensa",
      },
    ],
    historial: [{ fecha: "2026-03-12", estado: "postergado", nota: "Oficio del subsecretario de Medio Ambiente a Contraloría." }],
    verificado: false,
  },
  ...DECRETOS_AJUSTE_2026,
  // Detectados por el robot de revisión diaria (scripts/revisar.mjs).
  ...(automaticos as Proyecto[]),
];
