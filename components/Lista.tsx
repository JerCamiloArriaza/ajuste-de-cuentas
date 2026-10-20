"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { contarPorEstado, filtrar, formatearFecha, formatearMonto, totales } from "@/lib/proyectos";
import { ESTADOS, ORDEN_ESTADOS, TIPOS, type Estado, type Proyecto } from "@/lib/tipos";
import { AvisoPorVerificar, EtiquetaEstado } from "./EtiquetaEstado";

export function Lista({ proyectos }: { proyectos: Proyecto[] }) {
  const [estado, setEstado] = useState<Estado | "">("");
  const [area, setArea] = useState("");
  const [texto, setTexto] = useState("");

  const conteo = useMemo(() => contarPorEstado(proyectos), [proyectos]);
  const suma = useMemo(() => totales(proyectos), [proyectos]);
  const areas = useMemo(() => [...new Set(proyectos.map((p) => p.area))].sort(), [proyectos]);
  const visibles = filtrar(proyectos, { estado, area, texto });

  return (
    <div className="space-y-6">
      <section aria-label="Montos" className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
          <p className="text-sm text-stone-500">Ya recortado (decretos vigentes)</p>
          <p className="text-3xl font-bold tracking-tight">{formatearMonto(suma.decidido)}</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
          <p className="text-sm text-stone-500">Propuesto, en discusión (con monto conocido)</p>
          <p className="text-3xl font-bold tracking-tight">{formatearMonto(suma.propuesto)}</p>
        </div>
      </section>

      <section aria-label="Filtrar por estado" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {ORDEN_ESTADOS.map((e) => {
          const activo = estado === e;
          return (
            <button
              key={e}
              type="button"
              aria-pressed={activo}
              onClick={() => setEstado(activo ? "" : e)}
              className={`rounded-xl p-3 text-left transition ${ESTADOS[e].clase} ${
                activo ? "ring-2 ring-current" : "opacity-90 hover:opacity-100"
              }`}
            >
              <span className="block text-2xl font-bold">{conteo[e]}</span>
              <span className="text-sm font-medium">{ESTADOS[e].nombre}</span>
            </button>
          );
        })}
      </section>

      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Buscar</span>
          <input
            type="search"
            value={texto}
            onChange={(ev) => setTexto(ev.target.value)}
            placeholder="Buscar: salud, becas, Junaeb…"
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-900"
          />
        </label>
        <label>
          <span className="sr-only">Área</span>
          <select
            value={area}
            onChange={(ev) => setArea(ev.target.value)}
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 sm:w-auto dark:border-stone-700 dark:bg-stone-900"
          >
            <option value="">Todas las áreas</option>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="text-sm text-stone-500" aria-live="polite">
        {visibles.length} {visibles.length === 1 ? "registro" : "registros"}
        {estado && <> · {ESTADOS[estado].nombre}</>}
        {(estado || area || texto) && (
          <>
            {" · "}
            <button
              type="button"
              className="underline"
              onClick={() => {
                setEstado("");
                setArea("");
                setTexto("");
              }}
            >
              ver todo
            </button>
          </>
        )}
      </p>

      <ol className="space-y-3">
        {visibles.map((p) => (
          <li key={p.id}>
            <Link
              href={`/proyecto/${p.id}`}
              className="block rounded-xl border border-stone-200 bg-white p-4 transition hover:border-stone-400 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-600"
            >
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <EtiquetaEstado estado={p.estado} />
                <span className="text-xs font-medium text-stone-600 dark:text-stone-300">{TIPOS[p.tipo]}</span>
                <time dateTime={p.fecha} className="text-xs text-stone-500">
                  {formatearFecha(p.fecha)}
                </time>
                {!p.verificado && <AvisoPorVerificar />}
              </div>
              <h2 className="font-semibold leading-snug">{p.titulo}</h2>
              <p className="mt-1 line-clamp-3 text-sm text-stone-600 dark:text-stone-400">{p.resumen}</p>
              <p className="mt-2 text-xs text-stone-500">
                {p.area} · {p.ministerio}
              </p>
            </Link>
          </li>
        ))}
        {visibles.length === 0 && (
          <li className="rounded-xl border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500 dark:border-stone-700">
            No hay registros con esos filtros.
          </li>
        )}
      </ol>
    </div>
  );
}
