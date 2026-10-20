export type Estado = "eliminado" | "postergado" | "en_proceso" | "aprobado";

export type Tipo = "recorte" | "eliminacion" | "retiro" | "reformulacion";

export const TIPOS: Record<Tipo, string> = {
  recorte: "Recorte",
  eliminacion: "Eliminación",
  retiro: "Retiro",
  reformulacion: "Reformulación",
};

export type Fuente = {
  titulo: string;
  url: string;
  /** "oficial" = Diario Oficial, Dipres, Congreso, ministerios. "prensa" = complementaria. */
  tipo: "oficial" | "prensa";
};

export type CambioEstado = {
  fecha: string; // AAAA-MM-DD
  estado: Estado;
  nota?: string;
};

export type Proyecto = {
  id: string; // se usa en la URL: /proyecto/<id>
  titulo: string;
  resumen: string;
  area: string;
  ministerio: string;
  tipo: Tipo;
  estado: Estado;
  fecha: string; // fecha del último cambio, AAAA-MM-DD
  /** Monto recortado o eliminado, en millones de pesos (si se conoce). */
  montoMillones?: number;
  fuentes: Fuente[];
  historial: CambioEstado[];
  /** false = las cifras vienen de prensa y falta confirmarlas en el documento oficial. */
  verificado: boolean;
  /** true = creado por el robot de revisión diaria (scripts/revisar.mjs). */
  automatico?: boolean;
};

export const ESTADOS: Record<
  Estado,
  { nombre: string; descripcion: string; clase: string }
> = {
  eliminado: {
    nombre: "Eliminado",
    descripcion: "El programa o beneficio fue suprimido por decreto, ley u otra decisión formal.",
    clase: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
  },
  postergado: {
    nombre: "Postergado",
    descripcion: "Su ejecución fue suspendida, aplazada o quedó sin fecha.",
    clase: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  },
  en_proceso: {
    nombre: "En proceso",
    descripcion: "Anunciado o en tramitación (por ejemplo, en el Congreso), pero aún sin decisión final.",
    clase: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
  },
  aprobado: {
    nombre: "Aprobado",
    descripcion: "El cambio fue aprobado formalmente y está vigente.",
    clase: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  },
};

export const ORDEN_ESTADOS: Estado[] = ["eliminado", "postergado", "en_proceso", "aprobado"];
