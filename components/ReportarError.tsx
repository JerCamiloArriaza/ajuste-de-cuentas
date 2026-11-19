import { enlaceCorreccion } from "@/lib/sitio";

/** Canal de correcciones: la plataforma atribuye cifras y frases a personas reales, y debe poder corregirse. */
export function ReportarError({ titulo, ruta }: { titulo: string; ruta: string }) {
  return (
    <section aria-labelledby="titulo-correccion" className="rounded-xl border border-stone-200 p-4 dark:border-stone-800">
      <h2 id="titulo-correccion" className="text-lg font-semibold">
        ¿Algo está mal en esta ficha?
      </h2>
      <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
        Si una cifra, una fecha, una cita o una fuente es incorrecta, avísanos. Revisamos cada aviso contra el
        documento oficial y corregimos lo que corresponda. Si te citamos y tu postura quedó mal resumida, también
        puedes escribirnos.
      </p>
      <a
        href={enlaceCorreccion(titulo, ruta)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800"
      >
        Avisar de un error
      </a>
      <p className="mt-2 text-xs text-stone-500">
        Se abre en GitHub (necesitas una cuenta gratuita). El aviso es público: no escribas datos personales.
      </p>
    </section>
  );
}
