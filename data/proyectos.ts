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
  nota: "El Gobierno ingresa el proyecto de Presupuestos 2027 al Congreso. El plazo constitucional para despacharlo vence a fines de noviembre.",
} as const;

const COMISION_MIXTA = {
  fecha: "2026-11-06",
  estado: "en_proceso",
  nota: "La Comisión Mixta termina de votar las partidas y despacha el proyecto a la Cámara. Educación y Ciencia quedan rechazadas y el Ejecutivo no repone sus fondos.",
} as const;

const CAMARA_DESPACHA = {
  fecha: "2026-11-13",
  estado: "en_proceso",
  nota: "La Sala de la Cámara termina de votar y despacha el proyecto al Senado (segundo trámite).",
} as const;

const CAMARA_PRESUPUESTO = {
  titulo: "Cámara de Diputadas y Diputados – Cámara concluyó despacho del Presupuesto 2027 (13-11-2026)",
  url: "https://www.camara.cl/cms/2026/11/13/camara-concluyo-despacho-del-presupuesto-2027/",
  tipo: "oficial",
} as const;

const CAMARA_DESARROLLO_SOCIAL = {
  titulo: "Cámara de Diputadas y Diputados – Despacha partida de Desarrollo Social con rechazo a algunos servicios (13-11-2026)",
  url: "https://www.camara.cl/cms/2026/11/13/camara-despacha-partida-de-desarrollo-social-con-rechazo-a-algunos-servicios/",
  tipo: "oficial",
} as const;

export const PROYECTOS: Proyecto[] = [
  {
    id: "presupuesto-2027-yo-elijo-mi-pc",
    titulo: "Fin del programa “Yo Elijo mi PC” (notebooks para estudiantes)",
    resumen:
      "El proyecto de Presupuestos 2027 no incluye la asignación de Junaeb que financia la entrega de computadores a estudiantes de 7° básico. En 2026 esa asignación era de unos $34.796 millones. No se identifica una partida equivalente que la reemplace. El 13 de noviembre la Cámara rechazó los gastos variables de la partida de Educación; como el Congreso no puede aumentar el gasto, solo el Gobierno puede reponer esos fondos.",
    area: "Educación",
    ministerio: "Ministerio de Educación",
    tipo: "eliminacion",
    montoMillones: 34796,
    estado: "en_proceso",
    fecha: "2026-11-13",
    fuentes: [
      CAMARA_PRESUPUESTO,
      DIPRES_PRESUPUESTO_2027,
      {
        titulo: "BioBioChile – “Yo elijo mi PC” llega a su fin (1-10-2026)",
        url: "https://www.biobiochile.cl/noticias/nacional/chile/2026/10/01/yo-elijo-mi-pc-llega-a-su-fin-presupuesto-2027-de-kast-corta-entrega-de-notebooks-para-estudiantes.shtml",
        tipo: "prensa",
      },
    ],
    historial: [INGRESO_CONGRESO, COMISION_MIXTA, CAMARA_DESPACHA],
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
    fecha: "2026-11-13",
    fuentes: [
      CAMARA_PRESUPUESTO,
      DIPRES_OFERTA_2027,
      {
        titulo: "El Desconcierto – Gobierno suprime siete programas de Energía",
        url: "https://eldesconcierto.cl/hoja-ruta/presupuesto-2027-gobierno-kast-suprime-siete-programas-energia-afectando-comunidades-rurales-y-aisladas-n5462765",
        tipo: "prensa",
      },
    ],
    historial: [INGRESO_CONGRESO, COMISION_MIXTA, CAMARA_DESPACHA],
    verificado: false,
  },
  {
    id: "presupuesto-2027-liceos-bicentenario",
    titulo: "Recorte de 46,7% a Liceos Bicentenario",
    resumen:
      "El proyecto de Presupuestos 2027 reduce en 46,7% el financiamiento del programa Liceos Bicentenario de Excelencia, según la prensa. El 13 de noviembre la Cámara rechazó los gastos variables de la partida de Educación; como el Congreso no puede aumentar el gasto, solo el Gobierno puede reponer esos fondos.",
    area: "Educación",
    ministerio: "Ministerio de Educación",
    tipo: "recorte",
    estado: "en_proceso",
    fecha: "2026-11-13",
    fuentes: [
      CAMARA_PRESUPUESTO,
      DIPRES_OFERTA_2027,
      {
        titulo: "Sabes.cl – Los programas con mayores recortes en el Presupuesto 2027",
        url: "https://sabes.cl/2026/10/06/presupuesto-2027-los-programas-que-tendran-mayores-recortes-los-que-quedan-en-0-y-las-areas-que-recibiran-mas-recursos",
        tipo: "prensa",
      },
    ],
    historial: [INGRESO_CONGRESO, COMISION_MIXTA, CAMARA_DESPACHA],
    verificado: false,
  },
  {
    id: "presupuesto-2027-tenencia-responsable-mascotas",
    titulo: "Programa de Tenencia Responsable de Mascotas (Ley Cholito) cae 86%",
    resumen:
      "El programa pasaría de $3.634 millones en 2026 a $514 millones en 2027, según la prensa. El 13 de noviembre la Cámara rechazó los gastos variables de la partida de Interior; solo el Gobierno puede reponer esos fondos.",
    area: "Otra",
    ministerio: "Ministerio del Interior y Seguridad Pública",
    tipo: "recorte",
    montoMillones: 3120,
    estado: "en_proceso",
    fecha: "2026-11-13",
    fuentes: [
      CAMARA_PRESUPUESTO,
      DIPRES_OFERTA_2027,
      {
        titulo: "Sabes.cl – Los programas con mayores recortes en el Presupuesto 2027",
        url: "https://sabes.cl/2026/10/06/presupuesto-2027-los-programas-que-tendran-mayores-recortes-los-que-quedan-en-0-y-las-areas-que-recibiran-mas-recursos",
        tipo: "prensa",
      },
    ],
    historial: [INGRESO_CONGRESO, COMISION_MIXTA, CAMARA_DESPACHA],
    verificado: false,
  },
  {
    id: "presupuesto-2027-becas-chile",
    titulo: "Becas Chile: $1.907 millones menos y fin de los cursos de idiomas",
    resumen:
      "El proyecto asigna $21.810 millones a Becas Chile, frente a $23.717 millones en 2026. Además elimina la asignación de Cursos de Idiomas de Becas Chile. El presupuesto del Ministerio de Ciencia baja 7,4%. La partida de Ciencia llegó sin sus recursos desde la Comisión Mixta y el Ejecutivo no presentó indicaciones para reponerlos.",
    area: "Ciencia",
    ministerio: "Ministerio de Ciencia, Tecnología, Conocimiento e Innovación",
    tipo: "recorte",
    montoMillones: 1907,
    estado: "en_proceso",
    fecha: "2026-11-13",
    fuentes: [
      CAMARA_PRESUPUESTO,
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
    historial: [INGRESO_CONGRESO, COMISION_MIXTA, CAMARA_DESPACHA],
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
    fecha: "2026-11-13",
    fuentes: [
      CAMARA_PRESUPUESTO,
      DIPRES_PRESUPUESTO_2027,
      {
        titulo: "Movilh – Presupuesto 2027 sin financiamiento explícito para programas trans",
        url: "https://www.movilh.cl/kast-elimina-financiamiento-explicito-a-programas-para-personas-trans-en-el-presupuesto-2027/",
        tipo: "prensa",
      },
    ],
    historial: [INGRESO_CONGRESO, COMISION_MIXTA, CAMARA_DESPACHA],
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
    fecha: "2026-11-13",
    fuentes: [
      CAMARA_PRESUPUESTO,
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
    historial: [INGRESO_CONGRESO, COMISION_MIXTA, CAMARA_DESPACHA],
    verificado: false,
  },
  {
    id: "presupuesto-2027-universidad-de-chile",
    titulo: "Universidad de Chile: 19,4% menos para Actividades de Interés Nacional y PAES",
    resumen:
      "El proyecto de Presupuestos 2027 reduce en 19,4% real la asignación de Actividades de Interés Nacional de la Universidad de Chile, que también financia la aplicación de la PAES, según la prensa. El 13 de noviembre la Cámara rechazó los gastos variables de la partida de Educación; como el Congreso no puede aumentar el gasto, solo el Gobierno puede reponer esos fondos.",
    area: "Educación",
    ministerio: "Ministerio de Educación",
    tipo: "recorte",
    estado: "en_proceso",
    fecha: "2026-11-13",
    fuentes: [
      CAMARA_PRESUPUESTO,
      DIPRES_PRESUPUESTO_2027,
      {
        titulo: "El Mostrador – Presupuesto 2027 recorta fondos a la U. de Chile para PAES",
        url: "https://www.elmostrador.cl/noticias/pais/2026/10/07/presupuesto-2027-recorta-fondos-a-la-u-de-chile-para-paes-y-programas-de-interes-nacional/",
        tipo: "prensa",
      },
    ],
    historial: [INGRESO_CONGRESO, COMISION_MIXTA, CAMARA_DESPACHA],
    verificado: false,
  },
  {
    id: "oficio-hacienda-descontinuar-142-programas",
    titulo: "Hacienda pide a los ministerios evaluar descontinuar 142 programas",
    resumen:
      "En abril, un oficio de Hacienda para preparar el Presupuesto 2027 recomendó descontinuar 142 programas de 22 ministerios, con un costo anual cercano a $5,4 billones, y rebajar otros 260. El ministro Quiroz dijo que no era una decisión de cerrar programas, sino una recomendación. El oficio incluía el Programa de Alimentación Escolar (PAE) de Junaeb, pero el ministro Quiroz y la Junaeb descartaron recortarlo: dijeron que los estudiantes seguirán recibiendo su alimentación sin interrupciones. Lo que finalmente se recorta aparece en las fichas del Presupuesto 2027.",
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
        titulo: "El Dínamo – Junaeb descarta recorte del Programa de Alimentación Escolar (27-4-2026)",
        url: "https://www.eldinamo.cl/pais/2026/04/27/junaeb-descarta-recorte-de-plan-nacional-de-alimentacion-en-colegios/",
        tipo: "prensa",
      },
      {
        titulo: "Chilevisión – Quiroz: no habrá ningún tipo de recorte alimentario",
        url: "https://www.chilevision.cl/noticias/ministro-quiroz-sale-al-paso-por-oficios-de-hacienda-no-va-a-haber-ningun-tipo-de-recorte-alimentario/",
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
  {
    id: "presupuesto-2027-tramitacion-congreso",
    titulo: "Presupuesto 2027: qué rechazó la Cámara y qué viene en el Senado",
    resumen:
      "La Cámara despachó al Senado el 13 de noviembre el proyecto de Presupuestos 2027 (boletín 18702). Rechazó los gastos variables de las partidas de Interior, Educación, Secretaría General de Gobierno, Minería, Mujer y Cultura; Ciencia llegó sin sus recursos desde la Comisión Mixta y el Ejecutivo no presentó indicaciones para reponerlos. También rechazó fondos del Instituto Nacional de Deportes, de Senadis, del Servicio de Protección Especializada a la niñez, del Serviu de Tarapacá, de las subsecretarías del Ministerio del Trabajo y del INDH, además de la autorización para endeudarse hasta US$25 mil millones. Según la Cámara, el Congreso no puede aumentar el gasto: los rechazos piden al Ejecutivo reevaluar, y reponer fondos depende del Gobierno. Dipres indicó que el Ejecutivo prepara presentar en el Senado una glosa para reincorporar fondos de Coanil.",
    area: "Varias",
    ministerio: "Ministerio de Hacienda (Dipres)",
    tipo: "otro",
    estado: "en_proceso",
    fecha: "2026-11-13",
    fuentes: [
      CAMARA_PRESUPUESTO,
      CAMARA_DESARROLLO_SOCIAL,
      {
        titulo: "Radio U. de Chile – Comisión Mixta rechaza partidas de Educación y Ciencias (6-11-2026)",
        url: "https://radio.uchile.cl/2026/11/06/presupuesto-2027-avanza-pero-con-tropiezos-comision-mixta-rechaza-partidas-de-educacion-y-ciencias/",
        tipo: "prensa",
      },
    ],
    historial: [INGRESO_CONGRESO, COMISION_MIXTA, CAMARA_DESPACHA],
    verificado: true,
  },
  {
    id: "presupuesto-2027-ninez-siete-programas",
    titulo: "Siete programas de infancia pierden $34.451 millones",
    resumen:
      "Según CIPER, el proyecto de Presupuestos 2027 recorta $34.451 millones en siete programas de Desarrollo Social que atienden a infancia vulnerable, niños en proceso de adopción y recién nacidos. El mayor recorte es Cuidado Alternativo (−$16.879 millones, de $177 mil millones a $160 mil millones, pese a su evaluación favorable de Dipres); Adopción baja $514 millones. Al mismo tiempo, el Gobierno sube $74.100 millones a tres programas que se ejecutan con organismos privados y municipios. La Defensoría de la Niñez alertó que más de la mitad de las asignaciones para la infancia disminuyen. El 13 de noviembre la Cámara rechazó las asignaciones del Servicio de Protección Especializada y de Senadis, y en el debate se destacó que la partida de Desarrollo Social crece 1,9% y que la mitad de sus recursos van a la niñez.",
    area: "Niñez",
    ministerio: "Ministerio de Desarrollo Social y Familia",
    tipo: "recorte",
    montoMillones: 34451,
    estado: "en_proceso",
    fecha: "2026-11-13",
    fuentes: [
      CAMARA_DESARROLLO_SOCIAL,
      DIPRES_PRESUPUESTO_2027,
      {
        titulo: "CIPER – Gobierno recorta $34 mil millones en siete programas de infancia (7-10-2026)",
        url: "https://www.ciperchile.cl/2026/10/07/gobierno-recorta-34-mil-millones-en-siete-programas-de-ayuda-a-infancia-vulnerable-ninos-en-proceso-de-adopcion-y-recien-nacidos/",
        tipo: "prensa",
      },
      {
        titulo: "CNN Chile – Defensoría de la Niñez: más de la mitad de las asignaciones para infancia disminuirán",
        url: "https://www.cnnchile.com/pais/presupuesto-2027-defensoria-de-la-ninez-alerta-que-mas-de-la-mitad-de-las-asignaciones-presupuestarias-para-la-infancia-disminuiran/",
        tipo: "prensa",
      },
    ],
    historial: [INGRESO_CONGRESO, COMISION_MIXTA, CAMARA_DESPACHA],
    verificado: false,
  },
  {
    id: "presupuesto-2027-fondo-tierras-indigenas",
    titulo: "Fondo de Tierras y Aguas Indígenas (Conadi): recorte en 2026 y disputa por 2027",
    resumen:
      "En 2026, el Decreto N°331 de Hacienda redujo en $7.634 millones el presupuesto de Conadi, que la prensa ubica sobre todo en el Fondo de Tierras y Aguas Indígenas. Para 2027, el proyecto de Presupuestos reasigna recursos de Conadi: el 13 de noviembre la Cámara rechazó las transferencias de capital al sector privado de ese fondo y aprobó una indicación de la diputada Emilia Nuyado que exige que su presupuesto no baje de unos $87 mil millones, el monto base de 2026. El Ejecutivo hizo reserva de constitucionalidad. En el debate hubo opiniones divididas: unos valoraron el cambio de foco; otros recordaron que es una obligación del Estado.",
    area: "Pueblos indígenas",
    ministerio: "Ministerio de Desarrollo Social y Familia",
    tipo: "reformulacion",
    estado: "en_proceso",
    fecha: "2026-11-13",
    fuentes: [
      CAMARA_DESARROLLO_SOCIAL,
      { titulo: "Decreto N°331 de 2026, Ministerio de Hacienda (Dipres)", url: "https://www.dipres.gob.cl/Decretos/2026/0331_TR.pdf", tipo: "oficial" },
      {
        titulo: "El Ciudadano – Quiroz arrincona fondo clave de la Conadi",
        url: "https://www.elciudadano.com/?p=1153592",
        tipo: "prensa",
      },
    ],
    historial: [
      { fecha: "2026-06-11", estado: "aprobado", nota: "Contraloría toma razón del Decreto N°331: Conadi pierde $7.634 millones en 2026." },
      INGRESO_CONGRESO,
      CAMARA_DESPACHA,
    ],
    verificado: false,
  },
  {
    id: "presupuesto-2027-fondo-apoyo-transporte-regional",
    titulo: "Fondo de Apoyo al Transporte Público y la Conectividad Regional: baja de más de 70%",
    resumen:
      "Durante la votación de la partida de Transportes, diputados de regiones criticaron la disminución de más de 70% del Fondo de Apoyo al Transporte Público y la Conectividad Regional, que según ellos significaría menos buses, menos trayectos y menos infraestructura. Señalaron que los recursos de la Región Metropolitana se mantienen mientras los de regiones se reducen. La cifra proviene de la intervención de los diputados, no de un documento de Dipres.",
    area: "Transporte",
    ministerio: "Ministerio de Transportes y Telecomunicaciones",
    tipo: "recorte",
    estado: "en_proceso",
    fecha: "2026-11-13",
    fuentes: [CAMARA_DESARROLLO_SOCIAL, DIPRES_PRESUPUESTO_2027],
    historial: [INGRESO_CONGRESO, CAMARA_DESPACHA],
    verificado: false,
  },
  ...DECRETOS_AJUSTE_2026,
  // Detectados por el robot de revisión diaria (scripts/revisar.mjs).
  ...(automaticos as Proyecto[]),
];
