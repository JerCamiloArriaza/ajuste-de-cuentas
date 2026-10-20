// Revisión diaria de fuentes. Uso: node scripts/revisar.mjs
//
// 1. Decretos de Dipres: descarga los decretos nuevos del año. Los de ajuste fiscal
//    (recortes) que logra leer se publican solos en data/automaticos.json, marcados
//    "Por verificar" y con el PDF oficial como fuente. Los que no logra leer quedan
//    en el informe para revisión humana.
// 2. Noticias: busca en Google Noticias titulares sobre recortes, eliminaciones,
//    postergaciones y retiros. NUNCA se publican solas: van al informe, porque la
//    prensa no basta como fuente (ver Metodología).
//
// Deja un resumen en informe-revision.md (el robot de GitHub lo abre como "issue").

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { esDecretoDeRecorte, fichaDeDecreto, leerListado, leerRecorte } from "./decretos.mjs";

const RAIZ = path.resolve(import.meta.dirname, "..");
const ESTADO = path.join(RAIZ, "data/revision.json");
const AUTOMATICOS = path.join(RAIZ, "data/automaticos.json");
const INFORME = path.join(RAIZ, "informe-revision.md");

const MAX_NOTICIAS = 60;

const BUSQUEDAS = [
  "gobierno recorte programa",
  "gobierno elimina programa",
  "descontinúa programa gobierno",
  "gobierno posterga proyecto",
  "gobierno retira proyecto de ley",
  "Hacienda decreto recorte presupuesto",
  "Presupuesto 2027 recorte",
];

const leerJson = (f, defecto) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : defecto);
const escribirJson = (f, datos) => fs.writeFileSync(f, JSON.stringify(datos, null, 2) + "\n");

async function descargar(url) {
  const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (ajuste-de-cuentas; revision diaria)" } });
  if (!r.ok) throw new Error(`${r.status} al descargar ${url}`);
  return r;
}

function pdfATexto(archivo) {
  return execFileSync("pdftotext", ["-layout", "-enc", "UTF-8", archivo, "-"], { encoding: "utf8" });
}

/** ids ya cargados a mano en data/*.ts, para no duplicarlos. */
function idsManuales() {
  const ids = new Set();
  for (const f of fs.readdirSync(path.join(RAIZ, "data")).filter((f) => f.endsWith(".ts"))) {
    for (const m of fs.readFileSync(path.join(RAIZ, "data", f), "utf8").matchAll(/id: "([^"]+)"/g)) ids.add(m[1]);
  }
  return ids;
}

async function revisarDecretos(estado, automaticos, informe) {
  const anio = String(new Date().getFullYear());
  const ultimo = Number(estado.decretos?.[anio] ?? 0);
  const listado = leerListado(
    await (await descargar(`https://www.dipres.gob.cl/Decretos/${anio}/decretos${anio}init.html`)).text(),
  );
  const nuevos = listado.filter((d) => Number(d.numero) > ultimo).sort((a, b) => a.numero - b.numero);
  console.log(`Decretos ${anio}: ${listado.length} en el listado, ${nuevos.length} nuevos desde el N°${ultimo}.`);

  const existentes = new Set([...idsManuales(), ...automaticos.map((p) => p.id)]);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "decretos-"));
  let maximo = ultimo;

  for (const d of nuevos) {
    try {
      const archivo = path.join(tmp, `${d.numero}.pdf`);
      fs.writeFileSync(archivo, Buffer.from(await (await descargar(d.url)).arrayBuffer()));
      const texto = pdfATexto(archivo);
      maximo = Math.max(maximo, Number(d.numero));
      if (!esDecretoDeRecorte(texto)) continue;

      const recorte = leerRecorte(texto);
      if (!recorte) {
        informe.decretosSinLeer.push(d);
        continue;
      }
      const ficha = fichaDeDecreto(d, recorte);
      if (existentes.has(ficha.id)) continue;
      automaticos.push(ficha);
      existentes.add(ficha.id);
      informe.publicados.push(ficha);
    } catch (e) {
      console.warn(`No se pudo revisar el decreto ${d.numero}: ${e.message}`);
      break; // se reintenta mañana desde este número
    }
  }
  estado.decretos = { ...estado.decretos, [anio]: maximo };
}

async function revisarNoticias(estado, informe) {
  const vistas = new Set(estado.noticiasVistas ?? []);
  for (const q of BUSQUEDAS) {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(`${q} when:2d`)}&hl=es-419&gl=CL&ceid=CL:es-419`;
    try {
      const xml = await (await descargar(url)).text();
      for (const item of xml.match(/<item>[\s\S]*?<\/item>/g) ?? []) {
        const titulo = item.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, "").trim();
        const enlace = item.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim();
        if (!titulo || !enlace || vistas.has(enlace)) continue;
        vistas.add(enlace);
        informe.noticias.push({ titulo: limpiarTitulo(decodificar(titulo)), enlace });
      }
    } catch (e) {
      console.warn(`Búsqueda "${q}" falló: ${e.message}`);
    }
  }
  estado.noticiasVistas = [...vistas].slice(-1000);
}

/** Los titulares vienen de internet y terminan en un aviso de GitHub: se les quita lo que pueda
 *  mencionar a usuarios (@), meter HTML o alargar el texto. */
function limpiarTitulo(s) {
  return s.replace(/@/g, "@​").replace(/[<>]/g, "").slice(0, 200);
}

function decodificar(s) {
  return s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function escribirInforme({ publicados, decretosSinLeer, noticias }) {
  if (!publicados.length && !decretosSinLeer.length && !noticias.length) {
    fs.rmSync(INFORME, { force: true });
    return;
  }
  const l = [];
  if (publicados.length) {
    l.push(`## Publicados automáticamente (${publicados.length})`, "");
    l.push("Recortes leídos de decretos oficiales. Quedan como **Por verificar**: revisa el PDF y completa el área y los programas afectados en `data/automaticos.json`.", "");
    for (const p of publicados) l.push(`- [ ] ${p.titulo} — [PDF](${p.fuentes[0].url})`);
    l.push("");
  }
  if (decretosSinLeer.length) {
    l.push(`## Decretos de ajuste que no se pudieron leer (${decretosSinLeer.length})`, "");
    for (const d of decretosSinLeer) l.push(`- [ ] Decreto N°${Number(d.numero)} (${d.fecha}) — [PDF](${d.url})`);
    l.push("");
  }
  if (noticias.length) {
    l.push(`## Noticias para revisar (${noticias.length})`, "");
    l.push("No se publican solas. Si alguna es un cambio real, busca la fuente oficial y agrégalo en `data/proyectos.ts`.", "");
    for (const n of noticias.slice(0, MAX_NOTICIAS)) l.push(`- [ ] [${n.titulo.replace(/[[\]]/g, "")}](${n.enlace})`);
    if (noticias.length > MAX_NOTICIAS) l.push("", `…y ${noticias.length - MAX_NOTICIAS} noticias más (no se muestran para no pasar el límite de GitHub).`);
  }
  // GitHub rechaza avisos de más de 65.536 caracteres.
  fs.writeFileSync(INFORME, l.join("\n").slice(0, 60000) + "\n");
}

const estado = leerJson(ESTADO, { decretos: {}, noticiasVistas: [] });
const automaticos = leerJson(AUTOMATICOS, []);
const informe = { publicados: [], decretosSinLeer: [], noticias: [] };

await revisarDecretos(estado, automaticos, informe);
await revisarNoticias(estado, informe);

escribirJson(AUTOMATICOS, automaticos);
escribirJson(ESTADO, estado);
escribirInforme(informe);
console.log(
  `Listo: ${informe.publicados.length} recortes publicados, ${informe.decretosSinLeer.length} decretos para revisar, ${informe.noticias.length} noticias nuevas.`,
);
