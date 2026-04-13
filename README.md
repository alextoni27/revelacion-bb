# Revelacion BB - Deploy en Netlify

Estructura recomendada para un sitio estatico listo para publicar.

## Estructura

- `index.html`: punto de entrada principal del sitio.
- `assets/css/main.css`: estilos del sitio.
- `assets/js/main.js`: script de interaccion (burbujas animadas).
- `netlify.toml`: configuracion de despliegue y headers de seguridad.
- `cronograma-revelacion.html`: archivo original (respaldo).

## Deploy en Netlify

1. Sube este proyecto a GitHub.
2. En Netlify, elige "Add new site" > "Import an existing project".
3. Selecciona tu repositorio.
4. Build command: dejar vacio.
5. Publish directory: `.`
6. Deploy.

## Nota

Netlify tomara `index.html` como pagina principal automaticamente.
