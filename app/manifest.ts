import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ajuste de Cuentas",
    short_name: "Ajuste",
    description: "Seguimiento de programas y proyectos públicos en Chile.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf9",
    theme_color: "#0c0a09",
    lang: "es-CL",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
