# Documentación de Cambios - Lab 6

## Parte 1: Correcciones
1. **Ruta /api/student**: Se agregó `await` ya que leer un archivo de esta manera es asíncrono. Se quitó `JSON.stringify()` porque el texto del archivo ya es una cadena JSON.
2. **Llaves faltantes**: Faltaban los `});` requeridos para cerrar `createServer` y `listen`.
3. **Ruta 404**: Se cambió de código HTTP 200 a 404.
4. **Ruta /info**: Tenía el MIME Type mal escrito (`application-json` en vez de `application/json`).

Nota: Estas correcciones estabilizan la primera fase.

## Parte 2: Nuevas Funcionalidades
1. **Ruta /info**: Cambiada para devolver un objeto JSON con las propiedades solicitadas.
2. **Ruta /saludo**: Se añadió devolviendo un saludo en texto plano.
3. **Ruta /api/status**: Ruta nueva que indica el estado del servidor (Ok, status, puerto).
4. **Respuesta 404 Dinámica**: Ahora muestra en el texto la variable `req.url` para especificar qué no se encontró.
