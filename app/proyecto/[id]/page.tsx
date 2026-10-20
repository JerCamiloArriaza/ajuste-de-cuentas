import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Compartir } from "@/components/Compartir";
import { AvisoPorVerificar, EtiquetaEstado } from "@/components/EtiquetaEstado";
import { buscarPorId, formatearFecha, formatearMonto, publicados } from "@/lib/proyectos";
import { ESTADOS, TIPOS } from "@/lib/tipos";
import { esUrlSegura } from "@/lib/urls";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return publicados().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = buscarPorId((await params).id);
  if (!p) return {};
  const titulo = `${ESTADOS[p.estado].nombre}: ${p.titulo}`;
  return {
    title: titulo,
    description: p.resumen,
    openGraph: { title: titulo, description: p.resumen, type: "article" },
    twitter: { card: "summary_large_image", title: titulo, description: p.resumen },
  };
}

export default async function Ficha({ params }: Props) {
  const p = buscarPorId((await params).id);
  if (!p) notFound();

  const historial = [...p.historial].sort((a, b) => b.fecha.localeCompare(a.fecha));

  return (
    <article className="space-y-8">
      <div>
        <Link href="/" className="text-sm text-stone-500 hover:underline">
          ← Volver
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <EtiquetaEstado estado={p.estado} />
          {!p.verificado && <AvisoPorVerificar />}
        </div>
        <h1 className="mt-2 text-2xl font-bold leading-tight">{p.titulo}</h1>
        <p className="mt-1 text-sm text-stone-500">
          {TIPOS[p.tipo]} · {p.area} · {p.ministerio} · Actualizado el{" "}
          <time dateTime={p.fecha}>{formatearFecha(p.fecha)}</time>
        </p>
        {p.montoMillones && (
          <p className="mt-3 text-3xl font-bold tracking-tight">{formatearMonto(p.montoMillones)}</p>
        )}
        <p className="mt-4">{p.resumen}</p>
      </div>

      {!p.verificado && (
        <p className="rounded-lg border border-dashed border-stone-400 p-3 text-sm text-stone-600 dark:text-stone-400">
          <strong>Por verificar:</strong> la información aún no ha sido revisada por una persona
          contra el documento oficial enlazado. Puede venir de la prensa o haber sido extraída
          automáticamente del documento.
        </p>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold">Historial</h2>
        <ol className="space-y-3 border-l-2 border-stone-200 pl-4 dark:border-stone-800">
          {historial.map((h, i) => (
            <li key={i}>
              <div className="flex flex-wrap items-center gap-2">
                <time dateTime={h.fecha} className="text-sm text-stone-500">
                  {formatearFecha(h.fecha)}
                </time>
                <EtiquetaEstado estado={h.estado} />
              </div>
              {h.nota && <p className="mt-1 text-sm">{h.nota}</p>}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Fuentes</h2>
        <ul className="space-y-2">
          {p.fuentes.map((f) => (
            <li key={f.url} className="text-sm">
              <span className="mr-2 rounded bg-stone-200 px-1.5 py-0.5 text-xs font-medium dark:bg-stone-800">
                {f.tipo === "oficial" ? "Oficial" : "Prensa"}
              </span>
              {esUrlSegura(f.url) ? (
                <a href={f.url} target="_blank" rel="noopener noreferrer" className="underline break-words">
                  {f.titulo}
                </a>
              ) : (
                <span>{f.titulo} (enlace no disponible)</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Compartir</h2>
        <Compartir titulo={p.titulo} ruta={`/proyecto/${p.id}`} />
      </section>
    </article>
  );
}
