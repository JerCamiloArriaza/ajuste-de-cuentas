import type { Metadata } from "next";
import { EtiquetaEstado } from "@/components/EtiquetaEstado";
import { ESTADOS, ORDEN_ESTADOS } from "@/lib/tipos";

export const metadata: Metadata = { title: "Metodología" };

export default function Metodologia() {
  return (
    <article className="space-y-6">
      <h1 className="text-2xl font-bold">Metodología</h1>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Qué significa cada estado</h2>
        <ul className="space-y-3">
          {ORDEN_ESTADOS.map((e) => (
            <li key={e} className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-3">
              <span className="sm:w-28 sm:shrink-0">
                <EtiquetaEstado estado={e} />
              </span>
              <span className="text-sm">{ESTADOS[e].descripcion}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2 text-sm">
        <h2 className="text-lg font-semibold">Cómo verificamos</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Un registro solo se publica si tiene al menos una <strong>fuente oficial</strong>: Diario
            Oficial, Dipres, Ley de Presupuestos, Contraloría, Cámara, Senado o el ministerio
            respectivo.
          </li>
          <li>La prensa se usa como fuente complementaria, nunca como única fuente.</li>
          <li>Un anuncio no es una decisión: mientras no exista un acto formal, el estado es “En proceso”.</li>
          <li>Cada cambio de estado queda en el historial con su fecha.</li>
          <li>
            “Por verificar” significa que una persona todavía no ha revisado la ficha contra el
            documento oficial enlazado.
          </li>
          <li>
            Mientras el Presupuesto 2027 se tramita en el Congreso, sus recortes figuran como “En
            proceso”. Pasan a “Eliminado” o “Aprobado” cuando se publica la ley.
          </li>
        </ul>
      </section>

      <section className="space-y-2 text-sm">
        <h2 className="text-lg font-semibold">Cómo se actualiza</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Todos los días un programa revisa los decretos de modificación presupuestaria que publica
            la Dirección de Presupuestos. Cuando encuentra un decreto de ajuste fiscal (recorte), lee
            el organismo y el monto y publica la ficha con el decreto como fuente, marcada “Por
            verificar”.
          </li>
          <li>
            El mismo programa busca noticias sobre recortes, eliminaciones, postergaciones y retiros.
            Las noticias <strong>no se publican solas</strong>: quedan en una lista para que una
            persona busque la fuente oficial antes de agregarlas.
          </li>
          <li>
            Los montos de los decretos corresponden a la reducción del aporte fiscal a cada organismo,
            en pesos de 2026.
          </li>
        </ul>
      </section>

      <section className="space-y-2 text-sm">
        <h2 className="text-lg font-semibold">Quiénes somos</h2>
        <p>
          Ajuste de Cuentas es un proyecto ciudadano sin fines de lucro. Su objetivo es que cualquier
          persona pueda saber, con fuentes, qué está cambiando en los programas públicos.
        </p>
      </section>
    </article>
  );
}
