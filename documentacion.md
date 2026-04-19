# Documentación de Cambios - Lab 6

## Parte 1: Correcciones
1. **Ruta /api/student**: Se agregó `await` ya que leer un archivo de esta manera es asíncrono. Se quitó `JSON.stringify()` porque el texto del archivo ya es una cadena JSON.
2. **Llaves faltantes**: Faltaban los `});` requeridos para cerrar `createServer` y `listen`.
3. **Ruta 404**: Se cambió de código HTTP 200 a 404.
4. **Ruta /info**: Tenía el MIME Type mal escrito (`application-json` en vez de `application/json`).
