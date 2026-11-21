# Seguridad

Ajuste de Cuentas es un sitio estático: no tiene cuentas de usuario, formularios, base de datos
ni datos personales. Lo que hay que proteger es la **integridad** de la información publicada.

## ¿Encontraste un problema?

Avísanos de forma privada desde la pestaña **Security → Report a vulnerability** de este
repositorio en GitHub. Por favor no lo publiques hasta que lo hayamos corregido.

## Cómo se protege la información

- Toda ficha automática solo puede citar PDF de decretos del sitio de Dipres; cualquier dato
  con forma inesperada o cifras fuera de lo razonable se desvía a revisión humana.
- Las noticias nunca se publican solas.
- Los cambios del robot pasan los tests antes de publicarse.
- Las acciones de GitHub están fijadas a una versión exacta y Dependabot vigila las dependencias.
- El sitio envía cabeceras de seguridad (CSP, anti-clickjacking, HSTS, etc.).

## Avisos en el celular (notificaciones)

Esta es la única parte del sitio que guarda algo de las personas, y guarda lo mínimo:

- **Qué se guarda:** el identificador técnico que entrega el navegador para poder enviar avisos y los estados
  que la persona eligió. No hay nombres, correos, teléfonos ni cuentas. Se guarda en Upstash Redis.
- **Cuánto tiempo:** hasta que la persona desactive los avisos, o hasta 400 días sin renovarse. Las
  suscripciones que el navegador informa como vencidas se borran al instante.
- **Quién puede enviar avisos:** solo el robot de GitHub, con un token secreto (`PUSH_ADMIN_TOKEN`). Sin
  el token, el servidor responde 401.
- **Protecciones:** el servidor solo acepta direcciones de los servicios de avisos de Google, Apple,
  Mozilla y Microsoft (evita que se use para consultar sitios ajenos); valida todos los datos; limita
  las peticiones por persona; acepta solo peticiones del propio sitio; y tiene un tope de suscripciones.
- **Claves:** la clave privada de envío (`VAPID_PRIVATE_KEY`) y el token viven solo como variables
  secretas de Vercel y GitHub, nunca en el código.

Pasos para activar o rotar las claves: [`docs/activar-avisos.md`](docs/activar-avisos.md).
