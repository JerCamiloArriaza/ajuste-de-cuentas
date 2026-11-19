import type { Fuente, Postura, Proyecto } from "@/lib/tipos";
import { DECRETOS_AJUSTE_2026 } from "./decretos-ajuste-2026";

/*
 * QUÉ DICE EL GOBIERNO Y QUÉ SE CRITICA, CON FUENTE.
 *
 * Reglas (ver también la página "Metodología"):
 *  - Solo personas o instituciones identificables, con su cargo. Nada anónimo.
 *  - El texto resume lo dicho; las citas textuales son cortas y van entre comillas.
 *  - La fuente debe poder abrirse. Si es un documento del Gobierno, la fuente es "oficial".
 *  - Se incluyen críticas de cualquier sector, también del oficialismo.
 *  - `alcance: "general"` marca explicaciones del Presupuesto o del ajuste en su conjunto.
 */

const oficial = (titulo: string, url: string): Fuente => ({ titulo, url, tipo: "oficial" });
const prensa = (titulo: string, url: string): Fuente => ({ titulo, url, tipo: "prensa" });

// ---- Fuentes -------------------------------------------------------------------------------
const CIRCULAR_12 = oficial(
  "Oficio Circular N°12 de Hacienda (13-03-2026), texto completo",
  "http://bibliotecadigital.dipres.gob.cl/bitstream/handle/11626/24126/Oficio_Circular_Hacienda_No_12.pdf",
);
const DIPRES_OFERTA = oficial(
  "Dipres – Informe Oferta Programática 2027 (6-10-2026)",
  "https://www.dipres.gob.cl/597/articles-433302_doc_pdf.pdf",
);
const CAMARA_DESARROLLO_SOCIAL = oficial(
  "Cámara de Diputadas y Diputados – Despacha partida de Desarrollo Social con rechazo a algunos servicios (13-11-2026)",
  "https://www.camara.cl/cms/2026/11/13/camara-despacha-partida-de-desarrollo-social-con-rechazo-a-algunos-servicios/",
);
const CAMARA_PRESUPUESTO = oficial(
  "Cámara de Diputadas y Diputados – Cámara concluyó despacho del Presupuesto 2027 (13-11-2026)",
  "https://www.camara.cl/cms/2026/11/13/camara-concluyo-despacho-del-presupuesto-2027/",
);
const T13_MINSAL = prensa(
  "T13 – Minsal explica recorte y asegura que no afectará atenciones (14-5-2026)",
  "https://www.t13.cl/amp/noticia/nacional/minsal-explica-recorte-asegura-no-afectara-atenciones-ajustes-apuntan-principal-14-5-2026",
);
const UCHILE_SALUD = prensa(
  "Radio U. de Chile – Recortes en salud: el transversal emplazamiento contra el Gobierno (15-5-2026)",
  "https://radio.uchile.cl/2026/05/15/recortes-en-salud-el-transversal-emplazamiento-contra-el-gobierno-por-ajuste-de-413-mil-millones/",
);
const DINAMO_DESARROLLO_SOCIAL = prensa(
  "El Dínamo – Recortes en Desarrollo Social: cómo se ejecutará la reducción de $32.721 millones (29-4-2026)",
  "https://www.eldinamo.cl/pais/2026/04/29/recortes-en-programas-de-desarrollo-social-como-se-ejecutara-la-reduccion-de-32-721-millones-y-la-controversia-que-vuelve-a-complicar-al-gobierno/",
);
const MEGANOTICIAS_DESARROLLO_SOCIAL = prensa(
  "Meganoticias – Hacienda recorta $32.721 millones en Desarrollo Social (29-4-2026)",
  "https://www.meganoticias.cl/amp/nacional/520764-ministerio-hacienda-ministro-jorge-quiroz-recorte-presupuesto-desarrollo-social-programas-infancia-29-04-2026.html",
);
const DINAMO_PAVEZ = prensa(
  "El Dínamo – Gobierno defiende fin de Yo Elijo mi PC (2-10-2026)",
  "https://www.eldinamo.cl/politica/2026/10/02/gobierno-defiende-fin-de-yo-elijo-mi-pc-no-tiene-efecto-relevante-en-el-aprendizaje/",
);
const PAUTA_YO_ELIJO = prensa(
  "Pauta – Quiroz confirma que “Yo elijo mi PC” queda sin fondos para 2027 (2-10-2026)",
  "https://www.pauta.cl/actualidad/2026/10/02/quiroz-confirma-que-yo-elijo-mi-pc-queda-sin-fondos-para-2027-y-recibe-criticas-de-distintos-sectores-politicos.html",
);
const LATERCERA_KAST = prensa(
  "La Tercera – Kast responde por recortes a programas de Educación (1-10-2026)",
  "https://www.latercera.com/nacional/noticia/kast-responde-por-recortes-a-programas-de-educacion-y-defiende-prioridades-del-presupuesto-2027/",
);
const DINAMO_QUIROZ_2027 = prensa(
  "El Dínamo – La defensa de Quiroz a los recortes en el Presupuesto 2027 (21-10-2026)",
  "https://www.eldinamo.cl/economia/2026/10/21/la-defensa-de-quiroz-a-los-recortes-en-el-presupuesto-2027/",
);
const CNN_DEFENSORIA = prensa(
  "CNN Chile – Defensoría de la Niñez: más de la mitad de las asignaciones para infancia disminuirán (20-10-2026)",
  "https://www.cnnchile.com/pais/presupuesto-2027-defensoria-de-la-ninez-alerta-que-mas-de-la-mitad-de-las-asignaciones-presupuestarias-para-la-infancia-disminuiran/",
);
const CIPER_HORIZONTE = prensa(
  "CIPER – Estudio de Horizonte Ciudadano: recortes en 48 programas sociales (16-10-2026)",
  "https://www.ciperchile.cl/2026/10/16/estudio-de-horizonte-ciudadano-proyecto-de-presupuesto-del-gobierno-propone-recortar-325-mil-millones-en-48-programas-sociales/",
);
const CHILEVISION_QUIROZ_OFICIO = prensa(
  "Chilevisión – Quiroz: “No va a haber ningún tipo de recorte alimentario” (24-4-2026)",
  "https://www.chilevision.cl/noticias/nacional/ministro-quiroz-sale-al-paso-por-oficios-de-hacienda-no-va-a-haber-ningun-tipo-de-recorte-alimentario/",
);
const CLINIC_OFICIALISTAS = prensa(
  "The Clinic – La molestia en los partidos oficialistas con Quiroz tras el oficio (27-4-2026)",
  "https://www.theclinic.cl/2026/04/27/no-por-ganar-la-eleccion-hay-chipe-libre-la-molestia-en-los-partidos-oficialistas-con-quiroz-tras-oficio-que-sugirio-recortes-y-fin-de-142-programas/",
);

const MOSTRADOR_KAST = prensa(
  "El Mostrador – Presidente Kast defiende retiro de decretos ambientales y negociación ramal (17-3-2026)",
  "https://www.elmostrador.cl/noticias/pais/2026/03/17/presidente-kast-defiende-retiro-de-decretos-ambientales-y-negociacion-ramal-no-es-urgente-hoy-dia/",
);
const DINAMO_PESCA = prensa(
  "El Dínamo – Las razones del Gobierno para retirar del Congreso el proyecto de pesca (26-3-2026)",
  "https://www.eldinamo.cl/politica/2026/03/26/ley-longueira-sigue-vigente-las-razones-del-gobierno-para-retirar-del-congreso-el-nuevo-proyecto-de-pesca/",
);
const CAMARA_AMBIENTAL = oficial(
  "Cámara de Diputadas y Diputados – Ejecutivo presentó hoja de ruta en materia medioambiental (25-3-2026)",
  "https://www.camara.cl/cms/2026/03/25/ejecutivo-presento-hoja-de-ruta-en-materia-medioambiental/",
);

// ---- Explicaciones generales -----------------------------------------------------------------
export const JUSTIFICACION_CIRCULAR_12: Postura = {
  autor: "Ministerio de Hacienda (Oficio Circular N°12)",
  fecha: "2026-03-13",
  alcance: "general",
  texto:
    "Hacienda explica que Chile tuvo déficit estructural en 16 de los últimos 18 años, que la deuda bruta del gobierno central subió de 5% a 42% del PIB y que 2025 cerró con un exceso de gasto cercano a US$10.000 millones sobre los ingresos. El Plan de Ajuste Fiscal busca reducir gasto por tres vías: combatir abusos y malas prácticas, mayor eficiencia y austeridad. Su primera fase recorta US$3.000 millones el límite de gasto de 2026, con carácter permanente, e incluye una rebaja transversal de 3% al gasto bruto de cada partida, aplicada por decreto.",
  fuente: CIRCULAR_12,
};

const DIPRES_GENERAL: Postura = {
  autor: "Dirección de Presupuestos (Dipres)",
  fecha: "2026-10-06",
  alcance: "general",
  texto:
    "Dipres explica que las evaluaciones pesaron más que el año anterior: los 144 programas con hallazgos relevantes bajan en promedio 18% (15% en el proceso previo) y los reformulados que fueron objetados técnicamente bajan 35%. Aclara que los programas con buenos resultados tampoco están exentos de rebajas, porque la restricción fiscal obliga a priorizar, y que las decisiones también responden a las prioridades de política pública del Gobierno.",
  fuente: DIPRES_OFERTA,
};

const KAST_GENERAL: Postura = {
  autor: "José Antonio Kast, Presidente de la República",
  fecha: "2026-10-01",
  alcance: "general",
  texto:
    "Dijo que el Presupuesto 2027 prioriza seguridad, el área social (salud, educación, previsión) y la inversión, y que los programas con malos resultados no recibirán más aportes «hasta que se ordene la casa» y se pueda justificar el gasto de cada peso. Afirmó que se revisaron 632 programas de 23 ministerios y que es un presupuesto «serio, responsable».",
  fuente: LATERCERA_KAST,
};

const QUIROZ_GENERAL: Postura = {
  autor: "Jorge Quiroz, ministro de Hacienda",
  fecha: "2026-10-21",
  alcance: "general",
  texto:
    "Sostuvo que el Presupuesto no ajusta ni recorta el gasto, sino que lo «modera». Dijo que los programas no siempre tienen buenas evaluaciones, que Dipres las está poniendo sobre la mesa y que cuando el gasto se descontrola también se descontrola el orden social y las funciones básicas del sector público.",
  fuente: DINAMO_QUIROZ_2027,
};

// ---- Posturas por ficha ------------------------------------------------------------------------
type Posturas = Pick<Proyecto, "justificacionOficial" | "criticas">;

export const POSTURAS: Record<string, Posturas> = {
  // Decreto 331: Desarrollo Social
  "decreto-331-2026": {
    justificacionOficial: [
      JUSTIFICACION_CIRCULAR_12,
      {
        autor: "Marcelo Sánchez, subsecretario de la Niñez",
        fecha: "2026-04-29",
        texto:
          "Dijo que el recorte no afectará beneficios directos y que son ajustes a la demanda real de gasto. Como ejemplo, explicó que se mantiene un stock de emergencia de 10.000 ajuares al mes cuando el gasto efectivo es de 7.800, con una natalidad a la baja, y que el Servicio de Protección nunca ha ejecutado más de 65% en diagnósticos clínicos.",
        fuente: DINAMO_DESARROLLO_SOCIAL,
      },
    ],
    criticas: [
      {
        autor: "Paulina Muñoz, diputada (PNL), integrante de la Comisión de Desarrollo Social",
        fecha: "2026-04-29",
        texto:
          "Rechazó que se quiten beneficios como el ajuar del recién nacido o recursos del Servicio de Protección de la Niñez, y pidió al Gobierno explicar con detalle qué implican las reducciones.",
        fuente: DINAMO_DESARROLLO_SOCIAL,
      },
      {
        autor: "Tamara Ramírez, diputada (PDG), presidenta de la Comisión de Desarrollo Social",
        fecha: "2026-04-29",
        texto:
          "Dijo que no aceptarán el recorte y que, si el Gobierno quiere ordenar las cuentas, debería partir por los privilegios de la política y el gasto innecesario del Estado.",
        fuente: DINAMO_DESARROLLO_SOCIAL,
      },
      {
        autor: "ANEF (Agrupación Nacional de Empleados Fiscales)",
        fecha: "2026-04-29",
        texto:
          "Calificó el decreto como un «ataque frontal» a la función pública y a los derechos ciudadanos, y cuestionó la legalidad de reducir por decreto fondos que el Congreso aprobó por ley.",
        fuente: MEGANOTICIAS_DESARROLLO_SOCIAL,
      },
    ],
  },

  // Decreto 333: Salud
  "decreto-333-2026": {
    justificacionOficial: [
      JUSTIFICACION_CIRCULAR_12,
      {
        autor: "Ministerio de Salud",
        fecha: "2026-05-14",
        texto:
          "Informó que el ajuste es de 2,5%, diseñado para resguardar la atención directa, y que en promedio equivale a 1,1% de los recursos operacionales de los hospitales (por ejemplo, 1,1% en el Sótero del Río y 1,4% en el del Salvador). En atención primaria, dijo, el ajuste final es de 0,5%. Afirmó que apunta a mejorar la eficiencia, reducir gastos innecesarios y fortalecer las compras centralizadas.",
        fuente: T13_MINSAL,
      },
      {
        autor: "Jorge Quiroz, ministro de Hacienda",
        fecha: "2026-05-15",
        texto:
          "Defendió el ajuste diciendo que «a veces uno, con menos recursos, hace más» y que hay espacio para mejorar la eficiencia hospitalaria y el uso de pabellones quirúrgicos.",
        fuente: UCHILE_SALUD,
      },
      {
        autor: "José Antonio Kast, Presidente de la República",
        fecha: "2026-05-15",
        texto: "Afirmó que no recortarán derechos sociales, pero que quieren administrar mejor unos recursos que son escasos.",
        fuente: UCHILE_SALUD,
      },
    ],
    criticas: [
      {
        autor: "Maximiliano Luksic, alcalde (independiente, electo con apoyo de Chile Vamos)",
        fecha: "2026-05-15",
        texto: "Pidió al Gobierno reflexionar sobre los recortes en Salud: dijo que la atención primaria ya está muy exigida y que cada peso menos significa peores atenciones.",
        fuente: UCHILE_SALUD,
      },
      {
        autor: "Omar Sabat, diputado (UDI)",
        fecha: "2026-05-15",
        texto: "Expresó preocupación por el efecto en hospitales de regiones y anunció un oficio al Ministerio de Salud para conocer el impacto concreto en insumos, especialistas y cirugías.",
        fuente: UCHILE_SALUD,
      },
      {
        autor: "Matías Fernández, diputado (Frente Amplio), integrante de la Comisión de Salud",
        fecha: "2026-05-15",
        texto: "Dijo que el decreto significa menos financiamiento para hospitales, Fonasa y atención primaria, y sostuvo que sería un ahorro fiscal para financiar la reforma tributaria.",
        fuente: UCHILE_SALUD,
      },
      {
        autor: "Karol Cariola, senadora (PC), integrante de la Comisión de Salud",
        fecha: "2026-05-15",
        texto: "Dijo estar de acuerdo con mejorar la gestión y la eficiencia del gasto, pero cuestionó que el Ejecutivo busque esa eficiencia mediante rebajas presupuestarias.",
        fuente: UCHILE_SALUD,
      },
    ],
  },

  // Presupuesto 2027
  "presupuesto-2027-yo-elijo-mi-pc": {
    justificacionOficial: [
      {
        autor: "Máximo Pavez, subsecretario del Interior",
        fecha: "2026-10-02",
        texto:
          "Sostuvo que el programa de becas TIC lleva tiempo en evaluación, está mal evaluado, no muestra un efecto relevante en el aprendizaje y tuvo problemas de implementación. Citó un informe de Contraloría según el cual más de 9 mil computadores no se entregaron entre 2015 y hoy. Dijo que el Gobierno busca poner los recursos donde mejor cumplan su finalidad educativa.",
        fuente: DINAMO_PAVEZ,
      },
      {
        autor: "Jorge Quiroz, ministro de Hacienda",
        fecha: "2026-10-02",
        texto:
          "Atribuyó la decisión a la revisión de más de 600 programas, muchos de los cuales presentan hallazgos o llegan a poca población. Consultado por este programa, no detalló las observaciones y dijo que «de seguro tenía hallazgos».",
        fuente: PAUTA_YO_ELIJO,
      },
      DIPRES_GENERAL,
    ],
    criticas: [
      {
        autor: "Sebastián Sichel, alcalde de Ñuñoa",
        fecha: "2026-10-02",
        texto: "Pidió explicaciones al Ministerio de Educación, defendió la relevancia de entregar los equipos y pidió reponer los recursos.",
        fuente: PAUTA_YO_ELIJO,
      },
      {
        autor: "Tomás Vodanovic, alcalde de Maipú",
        fecha: "2026-10-02",
        texto: "Vinculó la medida con otros ajustes y cuestionó que el Ejecutivo hubiera prometido mantener los beneficios sociales: «Cuando se achica el Estado, sufren los que más lo necesitan».",
        fuente: PAUTA_YO_ELIJO,
      },
      {
        autor: "Matías Walker, senador",
        fecha: "2026-10-02",
        texto: "Valoró el impacto del programa en estudiantes y familias y anunció que buscará recuperar su financiamiento en la discusión presupuestaria.",
        fuente: PAUTA_YO_ELIJO,
      },
    ],
  },
  "presupuesto-2027-liceos-bicentenario": { justificacionOficial: [DIPRES_GENERAL] },
  "presupuesto-2027-becas-chile": { justificacionOficial: [DIPRES_GENERAL] },
  "presupuesto-2027-universidad-de-chile": { justificacionOficial: [DIPRES_GENERAL] },
  "presupuesto-2027-tenencia-responsable-mascotas": { justificacionOficial: [DIPRES_GENERAL] },
  "presupuesto-2027-energia-siete-programas": { justificacionOficial: [DIPRES_GENERAL] },
  "presupuesto-2027-ninez-siete-programas": {
    justificacionOficial: [DIPRES_GENERAL, KAST_GENERAL],
    criticas: [
      {
        autor: "Defensoría de la Niñez (Defensor Anuar Quesille)",
        fecha: "2026-10-20",
        texto:
          "Su Observatorio analizó 197 asignaciones para niñez y adolescencia: 102 disminuyen, 63 aumentan y 32 se mantienen. Destaca bajas en cuidado alternativo y cerca de 59% en adopción. El Defensor dijo que cada disminución debe estar debidamente fundamentada y pidió a Hacienda transparentar las comparaciones y explicar los efectos en cobertura y calidad.",
        fuente: CNN_DEFENSORIA,
      },
      {
        autor: "Fundación Horizonte Ciudadano (creada por la expresidenta Michelle Bachelet)",
        fecha: "2026-10-16",
        texto:
          "Su estudio detecta recortes en al menos 48 programas sociales para población vulnerable por $325 mil millones y señala que contrastan con la promesa de campaña de no recortar beneficios sociales.",
        fuente: CIPER_HORIZONTE,
      },
    ],
  },
  "presupuesto-2027-fondo-tierras-indigenas": {
    justificacionOficial: [
      {
        autor: "Ejecutivo (en la votación de la Cámara)",
        fecha: "2026-11-13",
        texto: "Hizo reserva de constitucionalidad respecto de la indicación que fija un piso de unos $87 mil millones para el fondo.",
        fuente: CAMARA_DESARROLLO_SOCIAL,
      },
      DIPRES_GENERAL,
    ],
    criticas: [
      {
        autor: "Emilia Nuyado, diputada",
        fecha: "2026-11-13",
        texto: "Presentó la indicación, aprobada por la Sala, que exige que el presupuesto del fondo no sea inferior a unos $87 mil millones, el monto base de 2026, para cumplir los fines de la ley 19.253.",
        fuente: CAMARA_DESARROLLO_SOCIAL,
      },
    ],
  },
  "presupuesto-2027-programas-con-malas-evaluaciones": {
    justificacionOficial: [DIPRES_GENERAL, KAST_GENERAL],
    criticas: [
      {
        autor: "Fundación Horizonte Ciudadano (creada por la expresidenta Michelle Bachelet)",
        fecha: "2026-10-16",
        texto: "Su estudio sostiene que el proyecto recorta recursos en 48 programas sociales para población vulnerable, por $325 mil millones, lo que contrastaría con la promesa de campaña de no recortar beneficios sociales.",
        fuente: CIPER_HORIZONTE,
      },
    ],
  },
  "presupuesto-2027-tramitacion-congreso": {
    justificacionOficial: [
      {
        autor: "Dirección de Presupuestos",
        fecha: "2026-11-13",
        texto: "Indicó en la Cámara que el Ejecutivo prepara ingresar en el Senado una glosa para reincorporar los fondos de Coanil.",
        fuente: CAMARA_DESARROLLO_SOCIAL,
      },
      KAST_GENERAL,
      QUIROZ_GENERAL,
    ],
    criticas: [
      {
        autor: "Diputadas y diputados (según la Cámara)",
        fecha: "2026-11-13",
        texto: "Según la Cámara, la mayoría de los rechazos responde al llamado de los diputados para que el Ejecutivo reevalúe las asignaciones, ya que el Congreso no puede aumentar el gasto.",
        fuente: CAMARA_PRESUPUESTO,
      },
    ],
  },


  // Retiros de marzo de 2026
  "retiro-proyecto-negociacion-ramal": {
    justificacionOficial: [
      {
        autor: "José Antonio Kast, Presidente de la República",
        fecha: "2026-03-17",
        texto:
          "Dijo que hay más de 850 mil personas sin trabajo formal y que la negociación ramal no es urgente hoy: es, reconoció, una decisión política, pero fundada en la falta de crecimiento e inversión. Afirmó que las prioridades del Ejecutivo son la seguridad y el empleo.",
        fuente: MOSTRADOR_KAST,
      },
    ],
  },
  "retiro-nueva-ley-de-pesca": {
    justificacionOficial: [
      {
        autor: "Subsecretaría de Pesca",
        fecha: "2026-03-26",
        texto:
          "Informó al Consejo Nacional de Pesca que busca someter el proyecto a un proceso de estudio y perfeccionamiento, sin desecharlo por completo: su contenido, por ejemplo en investigación pesquera y enfoque ecosistémico, podría servir de punto de partida para una discusión más amplia, con instancias de diálogo y participación.",
        fuente: DINAMO_PESCA,
      },
    ],
    criticas: [
      {
        autor: "Alejandro Bernales, diputado (PL), presidente de la Comisión de Pesca",
        fecha: "2026-03-26",
        texto: "Criticó la falta de diálogo del Gobierno y preguntó si lo que buscan es volver a prácticas como la Ley Longueira.",
        fuente: DINAMO_PESCA,
      },
      {
        autor: "Nathalie Castillo, diputada (PC), integrante de la Comisión de Pesca",
        fecha: "2026-03-26",
        texto: "Dijo que retirarlo es una muy mala señal y que confirma que el Gobierno opta por «salvar» la Ley Longueira; recordó que era una demanda histórica de la pesca artesanal.",
        fuente: DINAMO_PESCA,
      },
      {
        autor: "Iván Flores, senador (DC)",
        fecha: "2026-03-26",
        texto: "Criticó que la decisión llegara sin aviso previo cuando el proyecto ya estaba votado en general y con la mayoría de sus artículos votados, con acuerdos bastante transversales.",
        fuente: DINAMO_PESCA,
      },
    ],
  },
  "retiro-43-decretos-ambientales": {
    justificacionOficial: [
      {
        autor: "Francisca Toledo, ministra del Medio Ambiente",
        fecha: "2026-03-25",
        texto:
          "Explicó ante la Comisión de Medio Ambiente de la Cámara que retirar los 43 decretos fue un acto de responsabilidad institucional, para revisarlos con detención y descartar errores o incompatibilidades con otras leyes, y así evitar futuras impugnaciones. Informó que ya se reingresaron dos y que se reingresaría el Plan de descontaminación del lago Villarrica.",
        fuente: CAMARA_AMBIENTAL,
      },
      {
        autor: "José Antonio Kast, Presidente de la República",
        fecha: "2026-03-17",
        texto:
          "Dijo que busca compatibilizar el crecimiento y el empleo con el resguardo ambiental, que cumplirán la ley pero que a veces se va más allá de ella, y que Chile es un país confiable cuando se cumplen los procedimientos y los plazos que fija la ley.",
        fuente: MOSTRADOR_KAST,
      },
    ],
    criticas: [
      {
        autor: "Gustavo Gatica y Jaime Bassa, diputados de la Comisión de Medio Ambiente",
        fecha: "2026-03-25",
        texto: "Pidieron que se especificaran el criterio para priorizar los reingresos y los plazos del proceso, y que se aclarara si en la decisión intervino otra cartera, como Hacienda.",
        fuente: CAMARA_AMBIENTAL,
      },
    ],
  },

  // Oficio de abril
  "oficio-hacienda-descontinuar-142-programas": {
    justificacionOficial: [
      {
        autor: "Jorge Quiroz, ministro de Hacienda",
        fecha: "2026-04-24",
        texto:
          "Explicó que se trata de un oficio, no de un decreto, parte de la formulación del presupuesto de mediano plazo y que Dipres envía cada año. Dijo que no hay ninguna decisión de descontinuar programas, que no habrá recortes en alimentación ni becas y que, en el caso de Educación, la decisión final corresponde al Mineduc. Agregó que las políticas vigentes no están en discusión: lo que se evalúa es cómo se ejecutan.",
        fuente: CHILEVISION_QUIROZ_OFICIO,
      },
      {
        autor: "José Antonio Kast, Presidente de la República",
        fecha: "2026-04-25",
        texto: "Dijo que «descontinuar», en términos económicos, no significa necesariamente poner fin a un programa, sino someterlo a evaluación.",
        fuente: CLINIC_OFICIALISTAS,
      },
    ],
    criticas: [
      {
        autor: "Ximena Ossandón, diputada (RN, oficialismo)",
        fecha: "2026-04-27",
        texto: "Dijo que Hacienda debe tener presentes los compromisos del Presidente, uno de los cuales era no tocar los programas sociales.",
        fuente: CLINIC_OFICIALISTAS,
      },
    ],
  },
};

// Todos los decretos de ajuste explican su origen en el mismo documento: el Oficio Circular N°12.
for (const d of DECRETOS_AJUSTE_2026) {
  POSTURAS[d.id] ??= { justificacionOficial: [JUSTIFICACION_CIRCULAR_12] };
}

/** Une las posturas a cada ficha. Lo que ya traiga la ficha (por ejemplo, las del robot) se respeta. */
export function conPosturas(p: Proyecto): Proyecto {
  const extra = POSTURAS[p.id] ?? (p.justificacionRef === "circular-12" ? { justificacionOficial: [JUSTIFICACION_CIRCULAR_12] } : undefined);
  if (!extra) return p;
  return {
    ...p,
    justificacionOficial: p.justificacionOficial ?? extra.justificacionOficial,
    criticas: p.criticas ?? extra.criticas,
  };
}
