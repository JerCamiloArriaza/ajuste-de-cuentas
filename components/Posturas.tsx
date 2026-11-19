import { formatearFecha } from "@/lib/proyectos";
import type { Postura } from "@/lib/tipos";
import { esUrlSegura } from "@/lib/urls";

function Item({ p }: { p: Postura }) {
  return (
    <li className="space-y-1.5 rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold">
        <span>{p.autor}</span>
        {p.alcance === "general" && (
          <span className="rounded bg-stone-200 px-1.5 py-0.5 text-[11px] font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-300">
            Explicación general
          </span>
        )}
      </p>
      <p className="text-sm leading-relaxed">{p.texto}</p>
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500">
        {p.fecha && <time dateTime={p.fecha}>{formatearFecha(p.fecha)}</time>}
        <span className="rounded bg-stone-100 px-1.5 py-0.5 font-medium dark:bg-stone-800">
          {p.fuente.tipo === "oficial" ? "Oficial" : "Prensa"}
        </span>
        {esUrlSegura(p.fuente.url) ? (
          <a href={p.fuente.url} target="_blank" rel="noopener noreferrer" className="break-words underline">
            {p.fuente.titulo}
          </a>
        ) : (
          <span>{p.fuente.titulo}</span>
        )}
      </p>
    </li>
  );
}

function Bloque({ id, titulo, ayuda, items, vacio }: { id: string; titulo: string; ayuda: string; items?: Postura[]; vacio: string }) {
  return (
    <section aria-labelledby={id} className="space-y-2">
      <div>
        <h2 id={id} className="text-lg font-semibold">
          {titulo}
        </h2>
        <p className="text-xs text-stone-500">{ayuda}</p>
      </div>
      {items && items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((p, i) => (
            <Item key={`${p.autor}-${i}`} p={p} />
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed border-stone-300 p-3 text-sm text-stone-500 dark:border-stone-700">{vacio}</p>
      )}
    </section>
  );
}

/** Explicación del Gobierno y críticas, cada una con su autor y su fuente. */
export function Posturas({ justificacion, criticas }: { justificacion?: Postura[]; criticas?: Postura[] }) {
  return (
    <div className="space-y-6">
      <Bloque
        id="titulo-gobierno"
        titulo="Qué dice el Gobierno"
        ayuda="Su explicación de la medida, con la fuente donde la dio."
        items={justificacion}
        vacio="Aún no hemos incorporado la explicación del Gobierno con fuente para este caso."
      />
      <Bloque
        id="titulo-criticas"
        titulo="Qué se critica"
        ayuda="Críticas de personas o instituciones identificables, de cualquier sector."
        items={criticas}
        vacio="Aún no hemos incorporado críticas con fuente para este caso."
      />
    </div>
  );
}
