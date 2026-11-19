"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  contarPorEstado,
  esDecreto,
  filtrar,
  formatearFecha,
  formatearMonto,
  nombreCorto,
  resumenTarjeta,
  totales,
} from "@/lib/proyectos";
import { ESTADOS, ORDEN_ESTADOS, TIPOS, type Estado, type Proyecto, type Tipo } from "@/lib/tipos";
import { ComparacionCambio } from "./ComparacionCambio";
import { AvisoPorVerificar, EtiquetaEstado } from "./EtiquetaEstado";
import { RankingDecretos } from "./RankingDecretos";

const CAMPO =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-900";

export function Lista({ proyectos }: { proyectos: Proyecto[] }) {
  const [estado, setEstado] = useState<Estado | "">("");
  const [area, setArea] = useState("");
  const [tipo, setTipo] = useState<Tipo | "">("");
  const [ministerio, setMinisterio] = useState("");
  const [texto, setTexto] = useState("");

  const conteo = useMemo(() => contarPorEstado(proyectos), [proyectos]);
  const suma = useMemo(() => totales(proyectos), [proyectos]);
  const areas = useMemo(() => [...new Set(proyectos.map((p) => p.area))].sort((a, b) => a.localeCompare(b, "es")), [proyectos]);
  const tipos = useMemo(() => [...new Set(proyectos.map((p) => p.tipo))], [proyectos]);
  const ministerios = useMemo(
    () => [...new Set(proyectos.map((p) => p.ministerio))].sort((a, b) => nombreCorto(a).localeCompare(nombreCorto(b), "es")),
    [proyectos],
  );

  const visibles = filtrar(proyectos, { estado, area, tipo, ministerio, texto });
  const cambios = visibles.filter((p) => !esDecreto(p));
  const decretos = visibles.filter(esDecreto);
  const hayFiltro = Boolean(estado || area || tipo || ministerio || texto);

  function limpiar() {
    setEstado("");
    setArea("");
    setTipo("");
    setMinisterio("");
    setTexto("");
  }

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

      <section aria-label="Buscar y filtrar" className="space-y-2">
        <label className="block">
          <span className="sr-only">Buscar</span>
          <input
            type="search"
            value={texto}
            onChange={(ev) => setTexto(ev.target.value)}
            placeholder="Buscar: salud, becas, Junaeb…"
            className={CAMPO}
          />
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <label>
            <span className="sr-only">Área</span>
            <select value={area} onChange={(ev) => setArea(ev.target.value)} className={CAMPO}>
              <option value="">Todas las áreas</option>
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Tipo de cambio</span>
            <select value={tipo} onChange={(ev) => setTipo(ev.target.value as Tipo | "")} className={CAMPO}>
              <option value="">Todos los tipos</option>
              {tipos.map((t) => (
                <option key={t} value={t}>
                  {TIPOS[t]}
                </option>
              ))}
            </select>
          </label>
          <label className="col-span-2 sm:col-span-1">
            <span className="sr-only">Ministerio</span>
            <select value={ministerio} onChange={(ev) => setMinisterio(ev.target.value)} className={CAMPO}>
              <option value="">Todos los ministerios</option>
              {ministerios.map((m) => (
                <option key={m} value={m}>
                  {nombreCorto(m)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <p className="text-sm text-stone-500" aria-live="polite">
        {visibles.length} {visibles.length === 1 ? "registro" : "registros"}
        {estado && <> · {ESTADOS[estado].nombre}</>}
        {hayFiltro && (
          <>
            {" · "}
            <button type="button" className="underline" onClick={limpiar}>
              limpiar filtros
            </button>
          </>
        )}
      </p>

      {cambios.length > 0 && (
        <section aria-labelledby="titulo-cambios" className="space-y-3">
          <h2 id="titulo-cambios" className="text-lg font-semibold">
            Presupuesto 2027 y otros cambios
          </h2>
          <ol className="space-y-3">
            {cambios.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/proyecto/${p.id}`}
                  className="block space-y-2 rounded-xl border border-stone-200 bg-white p-4 transition hover:border-stone-400 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-600"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <EtiquetaEstado estado={p.estado} />
                    <span className="text-xs font-medium text-stone-600 dark:text-stone-300">{TIPOS[p.tipo]}</span>
                    <time dateTime={p.fecha} className="text-xs text-stone-500">
                      {formatearFecha(p.fecha)}
                    </time>
                    {!p.verificado && <AvisoPorVerificar />}
                  </div>
                  <h3 className="font-semibold leading-snug">{p.titulo}</h3>
                  {p.comparacion && <ComparacionCambio c={p.comparacion} />}
                  <p className="text-sm text-stone-600 dark:text-stone-400">{resumenTarjeta(p)}</p>
                  <p className="text-xs text-stone-500">
                    {p.area}
                    {nombreCorto(p.ministerio) !== p.area && <> · {nombreCorto(p.ministerio)}</>}
                  </p>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      {decretos.length > 0 && <RankingDecretos decretos={decretos} todos={hayFiltro && decretos.length <= 12} />}

      {visibles.length === 0 && (
        <p className="rounded-xl border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500 dark:border-stone-700">
          No hay registros con esos filtros.
        </p>
      )}
    </div>
  );
}
