"use client";

import Link from "next/link";
import { useState } from "react";
import { formatearMonto, nombreCorto } from "@/lib/proyectos";
import type { Proyecto } from "@/lib/tipos";

const VISIBLES = 6;

/** Los decretos de ajuste fiscal como ranking de barras: más fácil de leer que 26 tarjetas iguales. */
export function RankingDecretos({ decretos, todos }: { decretos: Proyecto[]; todos: boolean }) {
  const [abierto, setAbierto] = useState(false);
  const ordenados = [...decretos].sort((a, b) => (b.montoMillones ?? 0) - (a.montoMillones ?? 0));
  const maximo = ordenados[0]?.montoMillones ?? 1;
  const total = ordenados.reduce((s, p) => s + (p.montoMillones ?? 0), 0);
  const mostrar = abierto || todos ? ordenados : ordenados.slice(0, VISIBLES);

  return (
    <section aria-labelledby="titulo-decretos" className="space-y-3">
      <div>
        <h2 id="titulo-decretos" className="text-lg font-semibold">
          Recortes ya aplicados por decreto
        </h2>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          {ordenados.length} {ordenados.length === 1 ? "decreto" : "decretos"} de Hacienda en 2026 · {formatearMonto(total)} en total ·
          de mayor a menor
        </p>
      </div>

      <ol className="divide-y divide-stone-100 rounded-xl border border-stone-200 bg-white dark:divide-stone-800 dark:border-stone-800 dark:bg-stone-900">
        {mostrar.map((p) => (
          <li key={p.id}>
            <Link href={`/proyecto/${p.id}`} className="block px-3 py-2.5 hover:bg-stone-50 dark:hover:bg-stone-800">
              <div className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 truncate font-medium">{nombreCorto(p.ministerio)}</span>
                <span className="shrink-0 font-semibold tabular-nums">{formatearMonto(p.montoMillones ?? 0)}</span>
              </div>
              <div aria-hidden="true" className="mt-1.5 h-1.5 overflow-hidden rounded bg-stone-100 dark:bg-stone-800">
                <div
                  className="h-full rounded bg-red-600 dark:bg-red-400"
                  style={{ width: `${Math.max(2, ((p.montoMillones ?? 0) / maximo) * 100)}%` }}
                />
              </div>
            </Link>
          </li>
        ))}
      </ol>

      {!todos && ordenados.length > VISIBLES && (
        <button
          type="button"
          aria-expanded={abierto}
          onClick={() => setAbierto(!abierto)}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800"
        >
          {abierto ? "Ver menos" : `Ver los ${ordenados.length} decretos`}
        </button>
      )}
    </section>
  );
}
