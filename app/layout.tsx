import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

const SITIO = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITIO),
  title: { default: "Ajuste de Cuentas", template: "%s · Ajuste de Cuentas" },
  description:
    "Seguimiento de los programas y proyectos públicos eliminados, postergados, en proceso y aprobados en Chile, con fuentes oficiales.",
  appleWebApp: { capable: true, title: "Ajuste de Cuentas" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL">
      <body className="min-h-dvh antialiased">
        <header className="border-b border-stone-200 dark:border-stone-800">
          <nav className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="text-lg font-bold tracking-tight">
              Ajuste de Cuentas
            </Link>
            <Link href="/metodologia" className="text-sm underline-offset-4 hover:underline">
              Metodología
            </Link>
          </nav>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
        <footer className="mx-auto max-w-3xl px-4 pb-10 text-xs text-stone-500">
          Proyecto ciudadano sin fines de lucro. Cada registro enlaza a su fuente oficial y se
          actualiza a diario.{" "}
          <Link href="/metodologia" className="underline">
            Cómo trabajamos
          </Link>
          .
        </footer>
      </body>
    </html>
  );
}
