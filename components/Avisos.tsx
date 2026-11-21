"use client";

import { useEffect, useState } from "react";
import { CLAVE_PUBLICA_VAPID } from "@/lib/avisos/config";
import { ESTADOS, ORDEN_ESTADOS, type Estado } from "@/lib/tipos";

type Fase = "cargando" | "no-activo" | "no-compatible" | "instalar-ios" | "bloqueado" | "inactivo" | "activo";

const CLAVE_LOCAL = "avisos-estados";
const ETIQUETA: Record<Estado, string> = {
  aprobado: "Aprobados",
  eliminado: "Eliminados",
  postergado: "Postergados",
  en_proceso: "En proceso",
};

function aBytes(base64url: string): Uint8Array<ArrayBuffer> {
  const bin = atob(base64url.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(base64url.length / 4) * 4, "="));
  const salida = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) salida[i] = bin.charCodeAt(i);
  return salida;
}

function estadosGuardados(): Estado[] {
  try {
    const v = JSON.parse(localStorage.getItem(CLAVE_LOCAL) ?? "null");
    if (Array.isArray(v)) {
      const buenos = ORDEN_ESTADOS.filter((e) => v.includes(e));
      if (buenos.length) return buenos;
    }
  } catch {
    // sin almacenamiento local: se usa el valor por defecto
  }
  return [...ORDEN_ESTADOS];
}

function recordar(estados: Estado[]) {
  try {
    localStorage.setItem(CLAVE_LOCAL, JSON.stringify(estados));
  } catch {
    // no es grave
  }
}

/** Espera al service worker, pero no se queda colgado si el navegador no lo tiene. */
async function servicio(): Promise<ServiceWorkerRegistration> {
  const limite = new Promise<never>((_, rechazar) => setTimeout(() => rechazar(new Error("sin service worker")), 6000));
  return Promise.race([navigator.serviceWorker.ready, limite]);
}

async function enviar(ruta: string, cuerpo: unknown): Promise<boolean> {
  const r = await fetch(ruta, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cuerpo) });
  return r.ok;
}

export function Avisos() {
  const [fase, setFase] = useState<Fase>("cargando");
  const [estados, setEstados] = useState<Estado[]>([...ORDEN_ESTADOS]);
  const [ocupado, setOcupado] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    let vivo = true;
    (async () => {
      const listo = await fetch("/api/avisos/estado", { cache: "no-store" })
        .then((r) => r.json())
        .then((d: { disponible?: boolean }) => Boolean(d.disponible))
        .catch(() => false);
      if (!vivo) return;
      if (!listo) return setFase("no-activo");

      const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      const instalada = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
      const compatible = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
      if (!compatible) return setFase(ios && !instalada ? "instalar-ios" : "no-compatible");
      if (Notification.permission === "denied") return setFase("bloqueado");

      setEstados(estadosGuardados());
      try {
        const sub = await (await servicio()).pushManager.getSubscription();
        if (vivo) setFase(sub && Notification.permission === "granted" ? "activo" : "inactivo");
      } catch {
        if (vivo) setFase("no-compatible");
      }
    })();
    return () => {
      vivo = false;
    };
  }, []);

  async function activar() {
    setOcupado(true);
    setMensaje("");
    try {
      const permiso = await Notification.requestPermission();
      if (permiso !== "granted") {
        setFase(permiso === "denied" ? "bloqueado" : "inactivo");
        return;
      }
      const reg = await servicio();
      const sub =
        (await reg.pushManager.getSubscription()) ??
        (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: aBytes(CLAVE_PUBLICA_VAPID) }));
      if (!(await enviar("/api/avisos/suscribir", { suscripcion: sub.toJSON(), estados }))) throw new Error("el servidor no aceptó la suscripción");
      recordar(estados);
      setFase("activo");
      setMensaje("Listo: los avisos están activados.");
      await reg.showNotification("Avisos activados", {
        body: "Te avisaremos cuando una medida sea nueva o cambie de estado.",
        icon: "/icons/icon-192.png",
        tag: "ajuste-prueba",
      });
    } catch {
      setMensaje("No pudimos activar los avisos. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setOcupado(false);
    }
  }

  async function desactivar() {
    setOcupado(true);
    setMensaje("");
    try {
      const sub = await (await servicio()).pushManager.getSubscription();
      if (sub) {
        await enviar("/api/avisos/cancelar", { endpoint: sub.endpoint });
        await sub.unsubscribe();
      }
      setFase("inactivo");
      setMensaje("Avisos desactivados. Borramos tu suscripción.");
    } catch {
      setMensaje("No pudimos desactivar los avisos. Inténtalo de nuevo.");
    } finally {
      setOcupado(false);
    }
  }

  async function alternar(estado: Estado) {
    const nuevos = estados.includes(estado) ? estados.filter((e) => e !== estado) : ORDEN_ESTADOS.filter((e) => e === estado || estados.includes(e));
    if (nuevos.length === 0) {
      setMensaje("Elige al menos un tipo de aviso, o desactiva los avisos.");
      return;
    }
    setEstados(nuevos);
    recordar(nuevos);
    if (fase !== "activo") return;
    try {
      const sub = await (await servicio()).pushManager.getSubscription();
      if (sub && (await enviar("/api/avisos/suscribir", { suscripcion: sub.toJSON(), estados: nuevos }))) setMensaje("Preferencias guardadas.");
      else setMensaje("No pudimos guardar tus preferencias.");
    } catch {
      setMensaje("No pudimos guardar tus preferencias.");
    }
  }

  const caja = "space-y-4 rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900";
  const boton =
    "rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-stone-700 disabled:opacity-50 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-300";

  if (fase === "cargando") return <p className="text-sm text-stone-500">Revisando si tu celular puede recibir avisos…</p>;
  if (fase === "no-activo")
    return (
      <div className={caja}>
        <p className="text-sm">Los avisos todavía no están disponibles. Cuando lo estén, podrás activarlos desde esta misma página.</p>
      </div>
    );
  if (fase === "instalar-ios")
    return (
      <div className={caja}>
        <p className="font-semibold">En iPhone, primero instala la app</p>
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          <li>Abre esta página en Safari.</li>
          <li>Toca el botón Compartir y elige “Agregar a la pantalla de inicio”.</li>
          <li>Abre la app desde el nuevo ícono “AC” y vuelve a esta página para activar los avisos.</li>
        </ol>
        <p className="text-xs text-stone-500">Es una limitación de iPhone: solo las apps instaladas pueden recibir avisos (iOS 16.4 o más reciente).</p>
      </div>
    );
  if (fase === "no-compatible")
    return (
      <div className={caja}>
        <p className="text-sm">Este navegador no permite recibir avisos. Prueba con Chrome, Edge, Firefox o Safari actualizados, o con la app instalada.</p>
      </div>
    );
  if (fase === "bloqueado")
    return (
      <div className={caja}>
        <p className="text-sm font-semibold">Los avisos están bloqueados en este navegador</p>
        <p className="text-sm">
          Para activarlos, permite las notificaciones de este sitio en la configuración del navegador (en el candado junto a la dirección) y recarga la página.
        </p>
      </div>
    );

  return (
    <div className={caja}>
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold">¿De qué quieres recibir avisos?</legend>
        {ORDEN_ESTADOS.map((e) => (
          <label key={e} className="flex items-center gap-3 text-sm">
            <input type="checkbox" className="h-4 w-4" checked={estados.includes(e)} onChange={() => alternar(e)} />
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ESTADOS[e].clase}`}>{ETIQUETA[e]}</span>
          </label>
        ))}
      </fieldset>

      {fase === "inactivo" ? (
        <button type="button" className={boton} disabled={ocupado} onClick={activar}>
          {ocupado ? "Activando…" : "Activar avisos en este celular"}
        </button>
      ) : (
        <button
          type="button"
          disabled={ocupado}
          onClick={desactivar}
          className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-semibold hover:bg-stone-100 disabled:opacity-50 dark:border-stone-700 dark:hover:bg-stone-800"
        >
          {ocupado ? "Desactivando…" : "Desactivar avisos"}
        </button>
      )}
      {fase === "activo" && <p className="text-sm text-emerald-700 dark:text-emerald-300">Los avisos están activados en este celular.</p>}
      <p aria-live="polite" className="min-h-5 text-sm text-stone-600 dark:text-stone-400">
        {mensaje}
      </p>
    </div>
  );
}
