// Avisa a las personas suscritas cuando una ficha es nueva o cambia de estado.
// Uso: node scripts/avisar.mjs
//
// 1. Calcula el estado publicado y lo compara con data/avisos-estado.json (lo último que ya se avisó).
// 2. Si hay novedades, espera a que la web ya muestre los cambios y pide el envío al servidor.
// 3. Solo si el envío resulta bien, actualiza data/avisos-estado.json. Si falla, no lo toca y se reintenta.
//
// Variables: PUSH_ADMIN_TOKEN (secreto de GitHub) y SITE_URL (opcional).

import esbuild from "esbuild";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { calcularEventos } from "./avisos-diff.mjs";

const RAIZ = path.resolve(import.meta.dirname, "..");
const REGISTRO = path.join(RAIZ, "data/avisos-estado.json");
const SITIO = (process.env.SITE_URL ?? "https://ajuste-de-cuentas.vercel.app").replace(/\/$/, "");
const TOKEN = process.env.PUSH_ADMIN_TOKEN;
const ESPERA_MAXIMA_MS = 8 * 60_000;

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
const guardar = (estado) => {
  // Se ordenan las claves para que el archivo cambie solo cuando hay novedades reales.
  const ordenado = Object.fromEntries(Object.entries(estado).sort(([x], [y]) => (x < y ? -1 : x > y ? 1 : 0)));
  fs.writeFileSync(REGISTRO, JSON.stringify(ordenado, null, 2) + "\n");
};

async function cargarEstadoActual() {
  const salida = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "avisos-")), "estado.mjs");
  await esbuild.build({
    entryPoints: [path.join(RAIZ, "scripts/estado-publicado.ts")],
    bundle: true,
    platform: "node",
    format: "esm",
    outfile: salida,
    tsconfig: path.join(RAIZ, "tsconfig.json"),
    logLevel: "silent",
  });
  return import(pathToFileURL(salida).href);
}

/** Espera a que la página de cada novedad (muestra de hasta 5) ya muestre el estado nuevo. */
async function esperarPublicacion(eventos, nombres) {
  const muestra = eventos.slice(0, 5);
  const limite = Date.now() + ESPERA_MAXIMA_MS;
  for (;;) {
    const listas = await Promise.all(
      muestra.map(async (e) => {
        try {
          const r = await fetch(`${SITIO}/proyecto/${e.id}`, { cache: "no-store" });
          return r.ok && (await r.text()).includes(`<title>${nombres[e.estado]}: `);
        } catch {
          return false;
        }
      }),
    );
    if (listas.every(Boolean)) return true;
    if (Date.now() > limite) return false;
    await esperar(15_000);
  }
}

// Modo de prueba (solo desde GitHub, con el token): envía un aviso con el mismo formato que los reales (Chrome desconfía de mensajes que dicen "prueba"),
// sin tocar ninguna ficha ni el registro de lo ya avisado.
if (process.env.PRUEBA === "true") {
  if (!TOKEN) {
    console.error("Falta PUSH_ADMIN_TOKEN: no se puede enviar la prueba.");
    process.exit(1);
  }
  const r = await fetch(`${SITIO}/api/avisos/enviar`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ eventos: [{ id: "decreto-333-2026", titulo: "Recorte de $413.193 millones: Ministerio de Salud", estado: "aprobado", tipo: "cambio" }] }),
  });
  console.log(`Prueba de envío: HTTP ${r.status} ${await r.text()}`);
  process.exit(r.ok ? 0 : 1);
}

const { estadoPublicado, NOMBRES_ESTADO } = await cargarEstadoActual();
const actual = estadoPublicado();

if (!fs.existsSync(REGISTRO)) {
  guardar(actual);
  console.log(`Primera vez: se registra el estado de ${Object.keys(actual).length} fichas sin enviar avisos.`);
  process.exit(0);
}

const anterior = JSON.parse(fs.readFileSync(REGISTRO, "utf8"));
const eventos = calcularEventos(anterior, actual);

if (eventos.length === 0) {
  // Puede haber fichas que desaparecieron; el registro se mantiene al día sin avisar.
  if (JSON.stringify(anterior) !== JSON.stringify(actual)) guardar(actual);
  console.log("Sin novedades que avisar.");
  process.exit(0);
}

console.log(`Novedades (${eventos.length}):`);
for (const e of eventos) console.log(`  - ${e.tipo === "nuevo" ? "nueva" : "cambió a"} ${NOMBRES_ESTADO[e.estado]}: ${e.titulo.slice(0, 80)}`);

if (!TOKEN) {
  guardar(actual);
  console.log("Los avisos no están configurados (falta PUSH_ADMIN_TOKEN): se registra el estado sin enviar.");
  process.exit(0);
}

if (!(await esperarPublicacion(eventos, NOMBRES_ESTADO))) {
  console.error("La web todavía no muestra los cambios tras esperar. No se envía nada; se reintentará en la próxima corrida.");
  process.exit(1);
}

const respuesta = await fetch(`${SITIO}/api/avisos/enviar`, {
  method: "POST",
  headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
  body: JSON.stringify({ eventos: eventos.slice(0, 100) }),
});

if (respuesta.status === 503) {
  // El servidor aún no tiene la base de datos o las claves: se registra sin avisar, para no mandar todo de golpe cuando se active.
  guardar(actual);
  console.log("El servidor de avisos todavía no está activo: se registra el estado sin enviar.");
  process.exit(0);
}
if (!respuesta.ok) {
  console.error(`El servidor respondió ${respuesta.status}. No se marca como avisado; se reintentará.`);
  process.exit(1);
}

const resultado = await respuesta.json();
guardar(actual);
console.log(`Avisos enviados: ${resultado.enviados} de ${resultado.suscritas} suscritas (sin interés: ${resultado.sinInteres}, caducadas: ${resultado.caducadas}, fallidas: ${resultado.fallidas}).`);
