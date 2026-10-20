import { Lista } from "@/components/Lista";
import { publicados } from "@/lib/proyectos";

export default function Inicio() {
  return (
    <>
      <h1 className="mb-1 text-2xl font-bold">¿Qué está cambiando el gobierno?</h1>
      <p className="mb-6 text-sm text-stone-600 dark:text-stone-400">
        Programas y beneficios públicos que el gobierno de José Antonio Kast (desde el 11 de marzo
        de 2026) elimina, posterga, recorta o propone cambiar. Lo más reciente primero, siempre con
        fuente oficial.
      </p>
      <Lista proyectos={publicados()} />
    </>
  );
}
