import { describe, expect, it } from "vitest";
import { claveTitular, esMedioChileno, esNoticiaRelevante } from "../scripts/noticias.mjs";

describe("filtro de noticias", () => {
  it("acepta medios chilenos", () => {
    expect(esMedioChileno("https://www.latercera.com")).toBe(true);
    expect(esMedioChileno("https://www.biobiochile.cl")).toBe(true);
    expect(esMedioChileno("https://elmostrador.cl")).toBe(true);
    expect(esMedioChileno("https://www.infobae.com")).toBe(false);
    expect(esMedioChileno("https://www.diarioextra.com")).toBe(false);
    expect(esMedioChileno("")).toBe(false);
  });

  it("no se deja engañar por dominios parecidos", () => {
    expect(esMedioChileno("https://latercera.com.evil.example")).toBe(false);
    expect(esMedioChileno("https://notlatercera.com")).toBe(false);
  });

  it("deja pasar recortes en Chile y descarta los de otros países", () => {
    const chile = "https://www.latercera.com";
    expect(esNoticiaRelevante("Gobierno recorta fondos de Becas Chile en el Presupuesto 2027", chile)).toBe(true);
    expect(esNoticiaRelevante("Nación recortó de 128 a seis los medicamentos de Remediar", chile)).toBe(false);
    expect(esNoticiaRelevante("Gobierno de Petro anuncia recorte de gasto", chile)).toBe(false);
    expect(esNoticiaRelevante("Ministro inaugura nueva escuela en Temuco", chile)).toBe(false);
    expect(esNoticiaRelevante("Gobierno recorta programa", "https://www.infobae.com")).toBe(false);
  });

  it("reconoce la misma noticia aunque cambie el medio", () => {
    expect(claveTitular("Recorte a Becas Chile - La Tercera")).toBe(claveTitular("Recorte a Becas Chile - Emol"));
  });
});
