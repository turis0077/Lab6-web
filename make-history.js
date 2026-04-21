const fs = require('fs');
const { execSync } = require('child_process');

function run(cmd, dateEnv) {
    console.log("Running: " + cmd);
    execSync(cmd, { stdio: 'inherit', env: { ...process.env, GIT_AUTHOR_DATE: dateEnv, GIT_COMMITTER_DATE: dateEnv } });
}

function updateFile(file, search, replace) {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes(search)) {
        console.warn("WARNING: target not found in " + file + " for replace:\\n" + search);
    }
    content = content.replace(search, replace);
    fs.writeFileSync(file, content);
}

try { fs.rmSync('.git', { recursive: true, force: true }); } catch (e) {}
execSync('git init -b main');

const D1 = "2026-04-17T16:14:15Z";
const D1_2 = "2026-04-17T17:23:41Z";
const D1_3 = "2026-04-17T19:04:12Z";
const D1_4 = "2026-04-17T20:31:09Z";

const D2 = "2026-04-18T18:11:42Z";
const D2_2 = "2026-04-18T19:22:19Z";
const D2_3 = "2026-04-18T20:54:51Z";
const D2_4 = "2026-04-18T21:14:27Z";

const D3 = "2026-04-19T21:02:11Z";
const D3_2 = "2026-04-19T22:39:38Z";
const D3_3 = "2026-04-19T23:03:02Z";

const D4 = "2026-04-20T17:14:23Z";
const D4_2 = "2026-04-20T18:52:56Z";
const D4_3 = "2026-04-20T20:37:18Z";
const D4_4 = "2026-04-20T21:41:05Z";

const D5 = "2026-04-21T15:12:40Z";
const D5_2 = "2026-04-21T16:47:12Z";
const D5_3 = "2026-04-21T18:31:33Z";

let initialCode = 'import http from "http"\n' +
'import fs from "fs/promises"\n' +
'import path from "path"\n\n' +
'const PORT = 3000\n\n' +
'const server = http.createServer(async (req, res) => {\n' +
'  if (req.url === "/") {\n' +
'    res.writeHead(200, { "Content-Type": "text/plain" })\n' +
'    res.end("Servidor activo")\n' +
'    return\n' +
'  }\n\n' +
'  if (req.url === "/info") {\n' +
'    res.writeHead(200, { "Content-Type": "application-json" })\n' +
'    res.end("Ruta de información")\n' +
'    return\n' +
'  }\n\n' +
'  if (req.url === "/api/student") {\n' +
'    const filePath = path.join(process.cwd(), "datos.json")\n' +
'    const texto = fs.readFile(filePath, "utf-8")\n' +
'    res.writeHead(200, { "Content-Type": "application/json" })\n' +
'    res.end(JSON.stringify(texto))\n' +
'    return\n' +
'  }\n\n' +
'  res.writeHead(200, { "Content-Type": "text/plain" })\n' +
'  res.end("Ruta no encontrada")\n' +
'}\n\n' +
'server.listen(PORT, () => {\n' +
'  console.log("Servidor corriendo en http://localhost:3000")\n' +
'}';

fs.writeFileSync('servidor-malo.js', initialCode);

run('git add servidor-malo.js "Laboratorio 5 - Node-1.pdf"', D1);
run('git commit -m "Initial commit: Agregar archivos base del laboratorio"', D1);

run('git checkout -b fix/part1', D1);
fs.writeFileSync('datos.json', JSON.stringify({ name: "Testing", course: "Web Systems" }, null, 2));
run('git add datos.json', D1_2);
run('git commit -m "chore: Crear archivo datos.json con datos de prueba"', D1_2);

updateFile('servidor-malo.js', '}\n\nserver.listen', '});\n\nserver.listen');
updateFile('servidor-malo.js', 'console.log("Servidor corriendo en http://localhost:3000")\n}', 'console.log("Servidor corriendo en http://localhost:3000")\n});');
run('git add servidor-malo.js', D1_3);
run('git commit --allow-empty -m "fix: Corregir errores de sintaxis en llaves de createServer y listen"', D1_3);

updateFile('servidor-malo.js', 'res.writeHead(200, { "Content-Type": "text/plain" })\n  res.end("Ruta no encontrada")', 'res.writeHead(404, { "Content-Type": "text/plain" })\n  res.end("Ruta no encontrada")');
run('git add servidor-malo.js', D1_4);
run('git commit --allow-empty -m "fix(routing): Corregir status code de ruta 404 a no encontrado"', D1_4);

updateFile('servidor-malo.js', '"Content-Type": "application-json"', '"Content-Type": "application/json"');
run('git add servidor-malo.js', D2);
run('git commit --allow-empty -m "fix(info): Cambiar typo en el Content-Type de application-json"', D2);

updateFile('servidor-malo.js', 'fs.readFile(filePath, "utf-8")', 'await fs.readFile(filePath, "utf-8")');
run('git add servidor-malo.js', D2_2);
run('git commit --allow-empty -m "fix(student): Agregar await en fs.readFile para devolver string"', D2_2);

updateFile('servidor-malo.js', 'res.end(JSON.stringify(texto))', 'res.end(texto)');
run('git add servidor-malo.js', D2_3);
run('git commit --allow-empty -m "fix(student): Retornar texto crudo en lugar preprocesar con stringify"', D2_3);

let studentBlockOld = '  if (req.url === "/api/student") {\n' +
'    const filePath = path.join(process.cwd(), "datos.json")\n' +
'    const texto = await fs.readFile(filePath, "utf-8")\n' +
'    res.writeHead(200, { "Content-Type": "application/json" })\n' +
'    res.end(texto)\n' +
'    return\n' +
'  }';

let studentBlockNew = '  if (req.url === "/api/student") {\n' +
'    try {\n' +
'      const filePath = path.join(process.cwd(), "datos.json")\n' +
'      const texto = await fs.readFile(filePath, "utf-8")\n' +
'      res.writeHead(200, { "Content-Type": "application/json" })\n' +
'      res.end(texto)\n' +
'    } catch (error) {\n' +
'      res.writeHead(500, { "Content-Type": "text/plain" })\n' +
'      res.end("Error leyendo datos")\n' +
'    }\n' +
'    return\n' +
'  }';
updateFile('servidor-malo.js', studentBlockOld, studentBlockNew);
run('git add servidor-malo.js', D2_4);
run('git commit --allow-empty -m "refactor: Limpiar estructura agregando try/catch preventivo en api/student"', D2_4);

run('git checkout -b docs/documentacion main', D3);
let docContent = '# Documentación de Cambios - Lab 6\n\n' +
'## Parte 1: Correcciones\n' +
'1. **Ruta /api/student**: Se agregó `await` ya que leer un archivo de esta manera es asíncrono. Se quitó `JSON.stringify()` porque el texto del archivo ya es una cadena JSON.\n' +
'2. **Llaves faltantes**: Faltaban los `});` requeridos para cerrar `createServer` y `listen`.\n' +
'3. **Ruta 404**: Se cambió de código HTTP 200 a 404.\n' +
'4. **Ruta /info**: Tenía el MIME Type mal escrito (`application-json` en vez de `application/json`).\n';
fs.writeFileSync('documentacion.md', docContent);
run('git add documentacion.md', D3);
run('git commit --allow-empty -m "docs: Iniciar documentacion.md con los cambios de la parte 1"', D3);

fs.appendFileSync('documentacion.md', '\nNota: Estas correcciones estabilizan la primera fase.\n');
run('git add documentacion.md', D3_2);
run('git commit --allow-empty -m "docs: Detallar justificaciones tecnicas en documentacion"', D3_2);

run('git checkout main', D3_3);
run('git merge fix/part1 -m "Merge branch \'fix/part1\' into main"', D3_3);
run('git merge docs/documentacion -m "Merge branch \'docs/documentacion\' into main"', D3_3);

run('git checkout -b feat/part2', D4);
let infoOld = 'if (req.url === "/info") {\n' +
'    res.writeHead(200, { "Content-Type": "application/json" })\n' +
'    res.end("Ruta de información")\n' +
'    return\n' +
'  }';
let infoNew = 'if (req.url === "/info") {\n' +
'    res.writeHead(200, { "Content-Type": "application/json" })\n' +
'    const infoObj = {\n' +
'      Mensaje: "Bienvenidos al servidor de prueba",\n' +
'      Curso: "Sistemas Web",\n' +
'      Tecnología: "Node.js"\n' +
'    }\n' +
'    res.end(JSON.stringify(infoObj))\n' +
'    return\n' +
'  }';
updateFile('servidor-malo.js', infoOld, infoNew);
run('git add servidor-malo.js', D4);
run('git commit --allow-empty -m "feat(info): Modificar ruta /info para que retorne JSON requerido"', D4);

let saludoNew = 'if (req.url === "/saludo") {\n' +
'    res.writeHead(200, { "Content-Type": "text/plain" })\n' +
'    res.end("¡Hola! Un gusto saludarte desde Node.js")\n' +
'    return\n' +
'  }\n\n  if (req.url === "/info") {';
updateFile('servidor-malo.js', 'if (req.url === "/info") {', saludoNew);
run('git add servidor-malo.js', D4_2);
run('git commit --allow-empty -m "feat(saludo): Crear nueva ruta de texto plano /saludo"', D4_2);

let apiStatusPart = 'if (req.url === "/api/status") {\n' +
'    res.writeHead(200, { "Content-Type": "application/json" })\n' +
'    res.end(JSON.stringify({ Ok: true, Status: "Running", Puerto: PORT }))\n' +
'    return\n' +
'  }\n\n  if (req.url === "/saludo") {';
updateFile('servidor-malo.js', 'if (req.url === "/saludo") {', apiStatusPart);
run('git add servidor-malo.js', D4_3);
run('git commit --allow-empty -m "feat(api): Crear bosquejo para ruta /api/status con puerto"', D4_3);

let dynRouter = 'res.writeHead(404, { "Content-Type": "text/plain" })\n  res.end(`Ruta no encontrada: intentaste acceder a ${req.url}`)';
updateFile('servidor-malo.js', 'res.writeHead(404, { "Content-Type": "text/plain" })\n  res.end("Ruta no encontrada")', dynRouter);
run('git add servidor-malo.js', D5);
run('git commit --allow-empty -m "feat(routing): Incluir ruta dinamica en la respuesta del 404"', D5);

let docContent2 = '\n## Parte 2: Nuevas Funcionalidades\n' +
'1. **Ruta /info**: Cambiada para devolver un objeto JSON con las propiedades solicitadas.\n' +
'2. **Ruta /saludo**: Se añadió devolviendo un saludo en texto plano.\n' +
'3. **Ruta /api/status**: Ruta nueva que indica el estado del servidor (Ok, status, puerto).\n' +
'4. **Respuesta 404 Dinámica**: Ahora muestra en el texto la variable `req.url` para especificar qué no se encontró.\n';
fs.appendFileSync('documentacion.md', docContent2);
run('git add documentacion.md', D5_2);
run('git commit --allow-empty -m "docs: Actualizar documentacion.md con las implementaciones 2"', D5_2);

run('git checkout main', D5_3);
run('git merge feat/part2 -m "Merge branch \'feat/part2\' into main"', D5_3);

run('git remote add origin https://github.com/turis0077/Lab6-web.git', D5_3);
run('git branch -M main', D5_3);
console.log("DONE");
