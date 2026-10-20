"use client";

import { useEffect, useState } from "react";

export function Compartir({ titulo, ruta }: { titulo: string; ruta: string }) {
  const [copiado, setCopiado] = useState(false);
  const [url, setUrl] = useState(ruta);
  useEffect(() => setUrl(new URL(ruta, window.location.origin).href), [ruta]);
  const texto = `${titulo} – Ajuste de Cuentas`;

  async function copiar() {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      window.prompt("Copia el enlace:", url);
    }
  }

  const boton =
    "rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800";

  return (
    <div className="flex flex-wrap gap-2">
      <a
        className={boton}
        href={`https://wa.me/?text=${encodeURIComponent(`${texto} ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        WhatsApp
      </a>
      <a
        className={boton}
        href={`https://x.com/intent/post?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        X
      </a>
      <button type="button" className={boton} onClick={copiar}>
        {copiado ? "¡Copiado!" : "Copiar enlace"}
      </button>
    </div>
  );
}
