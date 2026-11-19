import { formatearPct, variacionPct } from "@/lib/proyectos";
import type { Comparacion } from "@/lib/tipos";

const pesos = (n: number) => `$${n.toLocaleString("es-CL")}`;

/** "Antes → después" destacado: lo primero que debería ver quien hojea la lista. */
export function ComparacionCambio({ c, grande = false }: { c: Comparacion; grande?: boolean }) {
  const pct = variacionPct(c);
  const baja = pct < 0;
  const etiqueta = `${c.etiqueta}: de ${pesos(c.antes)} a ${pesos(c.despues)} millones, ${baja ? "baja" : "sube"} ${formatearPct(pct).slice(1)}`;

  return (
    <div role="group" aria-label={etiqueta} className="rounded-lg bg-stone-100 px-3 py-2 dark:bg-stone-800">
      <p className="text-xs text-stone-500 dark:text-stone-400">{c.etiqueta}</p>
      <p className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 font-bold ${grande ? "text-2xl" : "text-lg"}`}>
        <span aria-hidden="true">{pesos(c.antes)}</span>
        <span aria-hidden="true" className="text-stone-400">
          →
        </span>
        <span aria-hidden="true">{pesos(c.despues)}</span>
        <span aria-hidden="true" className="text-xs font-medium text-stone-500 dark:text-stone-400">
          millones
        </span>
        <span
          aria-hidden="true"
          className={`rounded px-1.5 py-0.5 text-sm ${
            baja
              ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200"
              : "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200"
          }`}
        >
          {formatearPct(pct)}
        </span>
      </p>
    </div>
  );
}
