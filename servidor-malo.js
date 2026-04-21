import http from "http"
import fs from "fs/promises"
import path from "path"

const PORT = 3000

const server = http.createServer(async (req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.end("Servidor activo")
    return
  }

  if (req.url === "/api/status") {
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ Ok: true, Status: "Running", Puerto: PORT }))
    return
  }

  if (req.url === "/saludo") {
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.end("¡Hola! Un gusto saludarte desde Node.js")
    return
  }

  if (req.url === "/info") {
    res.writeHead(200, { "Content-Type": "application/json" })
    const infoObj = {
      Mensaje: "Bienvenidos al servidor de prueba",
      Curso: "Sistemas Web",
      Tecnología: "Node.js"
    }
    res.end(JSON.stringify(infoObj))
    return
  }

  if (req.url === "/api/student") {
    try {
      const filePath = path.join(process.cwd(), "datos.json")
      const texto = await fs.readFile(filePath, "utf-8")
      res.writeHead(200, { "Content-Type": "application/json" })
      res.end(texto)
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/plain" })
      res.end("Error leyendo datos")
    }
    return
  }

  res.writeHead(404, { "Content-Type": "text/plain" })
  res.end(`Ruta no encontrada: intentaste acceder a ${req.url}`)
});

server.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:3000")
});