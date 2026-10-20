import { ImageResponse } from "next/og";
import { buscarPorId, publicados } from "@/lib/proyectos";
import { ESTADOS } from "@/lib/tipos";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Ficha en Ajuste de Cuentas";

const COLORES = {
  eliminado: "#b91c1c",
  postergado: "#b45309",
  en_proceso: "#0369a1",
  aprobado: "#047857",
} as const;

export function generateStaticParams() {
  return publicados().map((p) => ({ id: p.id }));
}

export default async function Imagen({ params }: { params: Promise<{ id: string }> }) {
  const p = buscarPorId((await params).id);
  const estado = p?.estado ?? "en_proceso";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "#1c1917",
          color: "#fafaf9",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div
            style={{
              background: COLORES[estado],
              borderRadius: 999,
              padding: "8px 24px",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            {ESTADOS[estado].nombre}
          </div>
          {p && !p.verificado && <div style={{ fontSize: 28, color: "#a8a29e" }}>POR VERIFICAR</div>}
        </div>
        <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.15 }}>{p?.titulo ?? "Ajuste de Cuentas"}</div>
        <div style={{ fontSize: 28, color: "#a8a29e" }}>Ajuste de Cuentas · seguimiento con fuentes oficiales</div>
      </div>
    ),
    size,
  );
}
