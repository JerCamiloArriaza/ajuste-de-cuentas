import type { Metadata } from "next";
import Link from "next/link";
import { Avisos } from "@/components/Avisos";

export const metadata: Metadata = {
  title: "Avisos en tu celular",
  description: "Recibe un aviso en tu celular cuando una medida del gobierno sea nueva, se apruebe, se elimine, se postergue o esté en proceso.",
};

export default function PaginaAvisos() {
  return (
    <article className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Avisos en tu celular</h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
          Recibe una notificación cuando una medida del gobierno sea <strong>nueva</strong> o <strong>cambie de estado</strong>: aprobada, eliminada,
          postergada o en proceso. Elige cuáles te interesan.
        </p>
      </div>

      <Avisos />

      <section className="space-y-2 text-sm">
        <h2 className="text-lg font-semibold">Cómo funcionan</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Avisamos cuando publicamos una ficha nueva o cambia su estado, nunca por otros motivos ni con publicidad.</li>
          <li>Si hay varias novedades a la vez, te llega un solo aviso que las resume.</li>
          <li>Al tocar el aviso se abre la ficha, con la fuente oficial.</li>
          <li>Puedes cambiar lo que recibes o desactivar los avisos cuando quieras desde esta página.</li>
        </ul>
      </section>

      <section className="space-y-2 text-sm">
        <h2 className="text-lg font-semibold">Qué guardamos de ti</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Solo un identificador técnico que entrega tu navegador para poder enviarte avisos, y los tipos de aviso que elegiste. <strong>No pedimos
            nombre, correo ni teléfono</strong> y no sabemos quién eres.
          </li>
          <li>Los avisos viajan por el servicio de tu navegador (Google, Apple, Mozilla o Microsoft), que conoce ese identificador.</li>
          <li>Si desactivas los avisos, borramos tu suscripción. Si no se renueva en más de un año, se borra sola.</li>
          <li>
            Si tienes dudas o quieres reportar un problema, mira la{" "}
            <Link href="/metodologia#correcciones" className="underline">
              sección de correcciones
            </Link>
            .
          </li>
        </ul>
      </section>
    </article>
  );
}
