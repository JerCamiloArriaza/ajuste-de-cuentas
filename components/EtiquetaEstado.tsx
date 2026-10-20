import { ESTADOS, type Estado } from "@/lib/tipos";

export function EtiquetaEstado({ estado }: { estado: Estado }) {
  const e = ESTADOS[estado];
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${e.clase}`}>
      {e.nombre}
    </span>
  );
}

export function AvisoPorVerificar() {
  return (
    <span className="inline-block rounded border border-dashed border-stone-400 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-stone-500">
      Por verificar
    </span>
  );
}
