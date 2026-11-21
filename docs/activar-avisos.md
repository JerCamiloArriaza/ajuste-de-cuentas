# Activar los avisos en el celular

El código ya está publicado, pero los avisos **no funcionan hasta completar estos pasos**, que requieren
tu cuenta. Mientras tanto la página `/avisos` dice que aún no están disponibles y el enlace del menú no aparece.

Las claves están en `.secretos/avisos.json` (carpeta que git ignora; no la subas ni la compartas).

## 1. Base de datos gratuita (Upstash, desde Vercel)

1. Entra a tu proyecto `ajuste-de-cuentas` en https://vercel.com.
2. Pestaña **Storage** → **Create Database** (o **Marketplace**) → elige **Upstash Redis** → plan gratuito.
3. Conéctala al proyecto `ajuste-de-cuentas` para los ambientes **Production** (y Preview si quieres).
   Vercel agrega solo las variables `KV_REST_API_URL` y `KV_REST_API_TOKEN` (o `UPSTASH_REDIS_REST_URL`
   y `UPSTASH_REDIS_REST_TOKEN`). El código acepta cualquiera de los dos nombres.

## 2. Variables secretas en Vercel

En **Settings → Environment Variables** del proyecto, agrega (ambiente **Production**):

| Nombre | Valor | ¿Secreta? |
|---|---|---|
| `VAPID_PRIVATE_KEY` | el valor `VAPID_PRIVATE_KEY` de `.secretos/avisos.json` | **Sí** |
| `PUSH_ADMIN_TOKEN` | el valor `PUSH_ADMIN_TOKEN` de `.secretos/avisos.json` | **Sí** |
| `NEXT_PUBLIC_AVISOS` | `1` | No (hace aparecer el enlace "Avisos") |

Márcalas como **Sensitive** para que no se puedan leer después. Luego haz un **Redeploy** del último despliegue.

## 3. Secreto en GitHub

En el repositorio: **Settings → Secrets and variables → Actions → New repository secret**:

- Nombre: `PUSH_ADMIN_TOKEN`
- Valor: el mismo token del paso 2.

## 4. Probar

1. Abre https://ajuste-de-cuentas.vercel.app/avisos en tu celular (en iPhone, primero instala la app).
2. Pulsa **Activar avisos** y acepta el permiso: debe aparecer una notificación "Avisos activados".
3. En GitHub → **Actions → Avisos por cambios de estado → Run workflow** para ver que el robot corre bien.

## Rotar las claves (si sospechas que se filtraron)

Genera un token nuevo, cámbialo en Vercel y en GitHub, y haz Redeploy. Si cambias la clave VAPID, todas las
suscripciones deben renovarse (cambia también `CLAVE_PUBLICA_VAPID` en `lib/avisos/config.ts`).
