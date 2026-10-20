# Ajuste de Cuentas

Plataforma ciudadana, sin fines de lucro, para que la gente sepa qué programas y beneficios
públicos el gobierno **elimina**, **posterga**, **recorta** o propone cambiar. Cada ficha
enlaza a su fuente oficial. Funciona en el celular y se puede instalar como app.

## Cómo se alimenta sola

Todos los días, a las ~8:00, un robot (GitHub Actions, gratis) ejecuta `scripts/revisar.mjs`:

1. **Decretos de Dipres.** Descarga los decretos de modificación presupuestaria nuevos. Si es
   un decreto de ajuste fiscal (recorte), lee el ministerio y el monto, y **publica la ficha
   sola** en `data/automaticos.json` con el PDF oficial como fuente y el aviso “Por verificar”.
2. **Noticias.** Busca en Google Noticias titulares sobre recortes, eliminaciones,
   postergaciones y retiros. Estas **no se publican solas**: la prensa no basta como fuente.
3. **Aviso.** Si hay algo que revisar, abre un *issue* en GitHub (te llega por correo) con la
   lista: fichas nuevas para confirmar y noticias para investigar.

Antes de publicar, el robot corre los tests; si los datos quedan mal, no publica nada.

## Agregar o corregir una ficha a mano

- Cambios con fuente oficial: [`data/proyectos.ts`](data/proyectos.ts).
- Decretos del ajuste fiscal de 2026: [`data/decretos-ajuste-2026.ts`](data/decretos-ajuste-2026.ts).
- Fichas creadas por el robot: [`data/automaticos.json`](data/automaticos.json). Al revisarlas,
  completa `area` y el `resumen`, y cambia `verificado` a `true`.

Reglas: toda ficha necesita al menos una fuente `"oficial"` (si no, no aparece). Al cambiar
de estado, actualiza `estado`, `fecha` y agrega una línea en `historial`.

Puedes editar los archivos directamente en la web de GitHub (botón del lápiz). Al guardar,
la página se actualiza sola en un par de minutos.

## Probar en tu computador

```bash
npm install
npm run dev      # abre http://localhost:3000
npm test         # valida datos y lógica
node scripts/revisar.mjs   # corre el robot a mano (necesita pdftotext / poppler)
```

## Publicar en internet (gratis)

1. Crea una cuenta en https://github.com y un repositorio nuevo (público).
2. Sube esta carpeta al repositorio.
3. En https://vercel.com entra con tu cuenta de GitHub, elige “Add New → Project” e
   importa el repositorio. En “Environment Variables” agrega `NEXT_PUBLIC_SITE_URL` con la
   dirección final (ej. `https://ajuste-de-cuentas.vercel.app`) para que las vistas previas
   de WhatsApp y X funcionen.
4. En GitHub, pestaña **Actions**, activa los workflows. El robot correrá todos los días;
   también puedes lanzarlo con “Run workflow”.
