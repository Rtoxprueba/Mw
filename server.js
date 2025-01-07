import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url"; // Para manejar __dirname
import apiRoutes from "./routes/api.js"; // Importar rutas de la API

const app = express();
const PORT = process.env.PORT || 3000;

// Obtener __dirname en un entorno de módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para analizar JSON
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

// Usar rutas de la API
app.use("/api", apiRoutes);

// Ruta para la página de inicio
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).send("Página no encontrada");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
