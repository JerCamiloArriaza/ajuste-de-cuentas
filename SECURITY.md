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
