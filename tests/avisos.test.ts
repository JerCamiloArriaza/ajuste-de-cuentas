import { randomBytes } from "node:crypto";
import { describe, expect, it } from "vitest";
import { almacenMemoria } from "@/lib/avisos/almacen";
import { leerJson, mismoOrigen, tokenValido } from "@/lib/avisos/http";
import { armarAviso } from "@/lib/avisos/mensaje";
import { cancelar, enviarAvisos, suscribir, type Enviador } from "@/lib/avisos/servicio";
import { huella, validarEndpoint, validarEstados, validarEventos, validarSuscripcion, type EventoAviso } from "@/lib/avisos/validar";

const b64 = (n: number) => randomBytes(n).toString("base64url");
const FCM = "https://fcm.googleapis.com/fcm/send/abc123";
const sub = (endpoint = FCM) => ({ endpoint, keys: { p256dh: b64(65), auth: b64(16) } });
const ev = (id: string, estado: EventoAviso["estado"], tipo: EventoAviso["tipo"] = "nuevo"): EventoAviso => ({ id, titulo: `Título de ${id}`, estado, tipo });

describe("avisos: validación de la suscripción", () => {
  it("acepta las direcciones de los servicios de avisos conocidos", () => {
    for (const ok of [
      FCM,
      "https://updates.push.services.mozilla.com/wpush/v2/xyz",
      "https://web.push.apple.com/QAbc",
      "https://wns2-par02p.notify.windows.com/w/?token=abc",
    ]) {
      expect(validarEndpoint(ok), ok).not.toBeNull();
    }
  });

  it("rechaza cualquier otra dirección (protege de que el servidor consulte sitios ajenos)", () => {
    for (const mal of [
      "http://fcm.googleapis.com/fcm/send/abc",
      "https://evil.example/fcm/send/abc",
      "https://fcm.googleapis.com.evil.example/x",
      "https://evilfcm.googleapis.com/x",
      "https://user:pass@fcm.googleapis.com/x",
      "https://fcm.googleapis.com:8443/x",
      "https://localhost/x",
      "https://169.254.169.254/latest/meta-data",
      "javascript:alert(1)",
      "no es una url",
      "https://fcm.googleapis.com/" + "a".repeat(800),
      42,
      null,
    ]) {
      expect(validarEndpoint(mal as string), String(mal).slice(0, 50)).toBeNull();
    }
  });

  it("exige claves con el largo correcto", () => {
    expect(validarSuscripcion(sub())).not.toBeNull();
    expect(validarSuscripcion({ endpoint: FCM, keys: { p256dh: b64(64), auth: b64(16) } })).toBeNull();
    expect(validarSuscripcion({ endpoint: FCM, keys: { p256dh: b64(65), auth: b64(15) } })).toBeNull();
    expect(validarSuscripcion({ endpoint: FCM, keys: { p256dh: "!!!", auth: "!!!" } })).toBeNull();
    expect(validarSuscripcion({ endpoint: FCM })).toBeNull();
    expect(validarSuscripcion(null)).toBeNull();
  });

  it("valida los estados elegidos: al menos uno, sin repetir y solo los conocidos", () => {
    expect(validarEstados(["aprobado", "eliminado"])).toEqual(["eliminado", "aprobado"]);
    expect(validarEstados([])).toBeNull();
    expect(validarEstados(["aprobado", "aprobado"])).toBeNull();
    expect(validarEstados(["inventado"])).toBeNull();
    expect(validarEstados("aprobado")).toBeNull();
  });

  it("valida las novedades que envía el robot", () => {
    expect(validarEventos([ev("decreto-333-2026", "aprobado")])).toHaveLength(1);
    expect(validarEventos([])).toBeNull();
    expect(validarEventos([{ ...ev("a", "aprobado"), id: "Con Mayúsculas" }])).toBeNull();
    expect(validarEventos([{ ...ev("a", "aprobado"), tipo: "otro" }])).toBeNull();
    expect(validarEventos([{ ...ev("a", "aprobado"), titulo: "" }])).toBeNull();
    expect(validarEventos(Array.from({ length: 101 }, (_, i) => ev(`id-${i}`, "aprobado")))).toBeNull();
  });

  it("la huella es estable y no es la dirección", () => {
    expect(huella(FCM)).toBe(huella(FCM));
    expect(huella(FCM)).not.toContain("fcm");
    expect(huella(FCM)).not.toBe(huella(FCM + "x"));
  });
});

describe("avisos: texto del aviso", () => {
  it("con una sola novedad abre su ficha", () => {
    const a = armarAviso([ev("decreto-333-2026", "aprobado")], ["aprobado"])!;
    expect(a.titulo).toMatch(/^Aprobado: /);
    expect(a.url).toBe("/proyecto/decreto-333-2026");
    expect(a.cuerpo).toMatch(/Nuevo/);
  });

  it("distingue lo nuevo de un cambio de estado", () => {
    expect(armarAviso([ev("x", "eliminado", "cambio")], ["eliminado"])!.cuerpo).toMatch(/Cambió de estado/);
  });

  it("con varias novedades resume y abre la portada", () => {
    const a = armarAviso([ev("a", "aprobado"), ev("b", "aprobado"), ev("c", "eliminado"), ev("d", "en_proceso")], ["aprobado", "eliminado", "en_proceso"])!;
    expect(a.titulo).toBe("4 novedades en Ajuste de Cuentas");
    expect(a.cuerpo).toContain("2 aprobados");
    expect(a.cuerpo).toContain("1 eliminado");
    expect(a.cuerpo).toContain("1 en proceso");
    expect(a.url).toBe("/");
  });

  it("solo incluye lo que la persona eligió, y nada si no le interesa", () => {
    const eventos = [ev("a", "aprobado"), ev("b", "eliminado")];
    expect(armarAviso(eventos, ["eliminado"])!.url).toBe("/proyecto/b");
    expect(armarAviso(eventos, ["postergado"])).toBeNull();
  });

  it("recorta los títulos largos", () => {
    const a = armarAviso([{ ...ev("a", "aprobado"), titulo: "x".repeat(400) }], ["aprobado"])!;
    expect(a.titulo.length).toBeLessThanOrEqual(90);
  });
});

describe("avisos: almacén y servicio", () => {
  it("guarda, actualiza, respeta el tope y borra", async () => {
    const a = almacenMemoria(2);
    expect(await a.guardar(sub(FCM + "1"), ["aprobado"])).toBe("nueva");
    expect(await a.guardar(sub(FCM + "1"), ["eliminado"])).toBe("actualizada");
    expect(await a.guardar(sub(FCM + "2"), ["aprobado"])).toBe("nueva");
    expect(await a.guardar(sub(FCM + "3"), ["aprobado"])).toBe("lleno");
    expect(await a.total()).toBe(2);
    await a.borrar(FCM + "1");
    expect(await a.total()).toBe(1);
  });

  it("suscribir rechaza datos malos y acepta buenos", async () => {
    const a = almacenMemoria();
    expect((await suscribir({ suscripcion: sub("https://evil.example/x"), estados: ["aprobado"] }, a)).estado).toBe(400);
    expect((await suscribir({ suscripcion: sub(), estados: [] }, a)).estado).toBe(400);
    expect((await suscribir(null, a)).estado).toBe(400);
    expect((await suscribir({ suscripcion: sub(), estados: ["aprobado", "eliminado"] }, a)).estado).toBe(200);
    expect(await a.total()).toBe(1);
  });

  it("suscribir responde 503 cuando el almacén está lleno", async () => {
    const a = almacenMemoria(0);
    expect((await suscribir({ suscripcion: sub(), estados: ["aprobado"] }, a)).estado).toBe(503);
  });

  it("cancelar siempre responde bien y borra", async () => {
    const a = almacenMemoria();
    await suscribir({ suscripcion: sub(), estados: ["aprobado"] }, a);
    expect((await cancelar({ endpoint: FCM }, a)).estado).toBe(200);
    expect(await a.total()).toBe(0);
    expect((await cancelar({ endpoint: FCM }, a)).estado).toBe(200); // ya no existe: igual responde bien
    expect((await cancelar({ endpoint: "https://evil.example" }, a)).estado).toBe(400);
  });

  it("envía un aviso por persona, respeta sus estados y borra las suscripciones caducadas", async () => {
    const a = almacenMemoria();
    await a.guardar(sub(FCM + "todos"), ["eliminado", "postergado", "en_proceso", "aprobado"]);
    await a.guardar(sub(FCM + "soloEliminado"), ["eliminado"]);
    await a.guardar(sub(FCM + "caducada"), ["aprobado"]);
    await a.guardar(sub(FCM + "rota"), ["aprobado"]);
    const recibidos: Record<string, string> = {};
    const enviar: Enviador = async (s, aviso) => {
      if (s.endpoint.endsWith("caducada")) return { ok: false, caducada: true };
      if (s.endpoint.endsWith("rota")) throw new Error("falla de red");
      recibidos[s.endpoint.split("/").pop()!] = aviso.titulo;
      return { ok: true, caducada: false };
    };
    const r = await enviarAvisos({ eventos: [ev("a", "aprobado"), ev("b", "eliminado")], almacen: a, enviar });
    expect(r.estado).toBe(200);
    expect(r.cuerpo).toMatchObject({ suscritas: 4, enviados: 2, caducadas: 1, fallidas: 1 });
    expect(recibidos["todos1"] ?? recibidos[`${FCM}todos`.split("/").pop()!]).toBe("2 novedades en Ajuste de Cuentas");
    expect(Object.values(recibidos).some((t) => t.startsWith("Eliminado: "))).toBe(true);
    expect(await a.total()).toBe(3); // la caducada se borró; la que falló por red se conserva
  });

  it("no envía nada si las novedades son inválidas", async () => {
    let llamadas = 0;
    const r = await enviarAvisos({ eventos: [{ id: "MAL" }], almacen: almacenMemoria(), enviar: async () => (llamadas++, { ok: true, caducada: false }) });
    expect(r.estado).toBe(400);
    expect(llamadas).toBe(0);
  });
});

describe("avisos: controles de seguridad HTTP", () => {
  const token = "a".repeat(40);

  it("el token se compara completo y exige largo mínimo", () => {
    expect(tokenValido(`Bearer ${token}`, token)).toBe(true);
    expect(tokenValido(`Bearer ${token}x`, token)).toBe(false);
    expect(tokenValido(`Bearer ${"b".repeat(40)}`, token)).toBe(false);
    expect(tokenValido(token, token)).toBe(false); // sin "Bearer"
    expect(tokenValido(null, token)).toBe(false);
    expect(tokenValido("Bearer corto", "corto")).toBe(false); // el secreto debe tener al menos 32 caracteres
    expect(tokenValido(`Bearer ${token}`, undefined)).toBe(false);
  });

  it("solo acepta peticiones del propio sitio", () => {
    const pedido = (origen?: string) => new Request("https://x.test/api", { method: "POST", headers: origen ? { origin: origen } : {} });
    expect(mismoOrigen(pedido("https://ajuste-de-cuentas.vercel.app"))).toBe(true);
    expect(mismoOrigen(pedido("https://otro-sitio.example"))).toBe(false);
    expect(mismoOrigen(pedido())).toBe(false);
  });

  it("lee JSON con tope de tamaño y tipo correcto", async () => {
    const json = (cuerpo: string, tipo = "application/json") => new Request("https://x.test", { method: "POST", headers: { "content-type": tipo }, body: cuerpo });
    expect(await leerJson(json('{"a":1}'), 100)).toEqual({ a: 1 });
    expect(await leerJson(json('{"a":"' + "x".repeat(200) + '"}'), 100)).toBeUndefined();
    expect(await leerJson(json("{no es json"), 100)).toBeUndefined();
    expect(await leerJson(json('{"a":1}', "text/plain"), 100)).toBeUndefined();
  });
});

describe("avisos: la librería de envío se carga bien", () => {
  it("expone setVapidDetails y sendNotification, sea por default o directamente", async () => {
    const modulo = (await import("web-push")) as unknown as { default?: { setVapidDetails?: unknown; sendNotification?: unknown }; setVapidDetails?: unknown; sendNotification?: unknown };
    const webpush = modulo.default ?? modulo;
    expect(typeof webpush.setVapidDetails).toBe("function");
    expect(typeof webpush.sendNotification).toBe("function");
  });
});
