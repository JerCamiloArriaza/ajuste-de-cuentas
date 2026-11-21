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
            Una ficha sin la etiqueta “Por verificar” fue contrastada cifra por cifra con el
            documento oficial: el decreto publicado por Dipres, la tabla “Cuadro Comparativo
            Analítico 2026-2027” del proyecto de Presupuestos o el comunicado de la Cámara o del
            Senado. Cuando la prensa informó una cifra distinta a la oficial, la ficha lo dice y
            prevalece la cifra oficial.
          </li>
          <li>
            Los montos de Presupuestos 2027 comparan la ley de 2026 con el proyecto, ambos en pesos de
            2027, igual que Dipres. Por eso pueden diferir de cifras de prensa que comparan pesos
            nominales.
          </li>
          <li>
            Mientras el Presupuesto 2027 se tramita en el Congreso, sus recortes figuran como “En
            proceso”. Pasan a “Eliminado” o “Aprobado” cuando se publica la ley.
          </li>
        </ul>
      </section>

      <section className="space-y-2 text-sm">
        <h2 className="text-lg font-semibold">Qué dice el Gobierno y qué se critica</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Cada ficha separa la <strong>explicación del Gobierno</strong> de las <strong>críticas</strong>.
            Ambas llevan quién lo dijo, qué dijo y la fuente donde se puede leer o escuchar.
          </li>
          <li>
            Solo se incluyen personas o instituciones identificables, con su cargo. No se publican críticas
            anónimas ni “fuentes cercanas”.
          </li>
          <li>
            Se incorporan críticas de cualquier sector, también del oficialismo, y se indica cuando una
            organización tiene vínculos políticos conocidos.
          </li>
          <li>
            Los textos son resúmenes fieles; las citas textuales son breves y van entre comillas. Quien quiera
            el detalle puede abrir la fuente.
          </li>
          <li>
            “Explicación general” significa que el Gobierno o Dipres explicó el ajuste o el Presupuesto en su
            conjunto, no esta medida en particular. Cuando una medida tiene su propia explicación, aparece aparte.
          </li>
          <li>
            Si todavía no encontramos una explicación o una crítica con fuente, la ficha lo dice en lugar de
            dejarlo en blanco.
          </li>
        </ul>
      </section>

      <section id="instalar" className="space-y-2 text-sm">
        <h2 className="text-lg font-semibold">Instalar la app en tu celular</h2>
        <p>
          Ajuste de Cuentas funciona como una app: se abre desde un ícono en tu pantalla, sin barra del
          navegador. No pasa por ninguna tienda y no ocupa casi espacio.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Android (Chrome):</strong> toca el menú ⋮ y elige “Instalar aplicación” o “Agregar a la
            pantalla de inicio”.
          </li>
          <li>
            <strong>iPhone (Safari):</strong> toca el botón Compartir y elige “Agregar a la pantalla de
            inicio”.
          </li>
          <li>
            Necesita internet: siempre muestra la información actualizada y no guarda copias de las cifras. Sin
            conexión, la app te avisa en lugar de mostrar datos que podrían estar desactualizados.
          </li>
        </ul>
      </section>

      <section id="correcciones" className="space-y-2 text-sm">
        <h2 className="text-lg font-semibold">Correcciones</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Cada ficha tiene un botón “Avisar de un error”, y el pie de página también. Abre un formulario
            público en GitHub, con la ficha ya indicada, para reportar una cifra, una fecha, una cita, una
            postura o una fuente incorrecta.
          </li>
          <li>
            Revisamos cada aviso contra el documento oficial. Si el aviso es correcto, corregimos la ficha; si
            no, respondemos con la fuente que respalda lo publicado.
          </li>
          <li>
            Si una persona o institución citada considera que su postura quedó mal resumida, puede avisarnos
            por la misma vía y la revisamos con prioridad.
          </li>
          <li>
            Toda corrección queda registrada públicamente en el historial del proyecto, con fecha y detalle de
            lo que cambió.
          </li>
          <li>
            El formulario es público: pedimos no incluir datos personales. Por ahora es la única vía y requiere
            una cuenta gratuita de GitHub.
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
