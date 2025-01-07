import express from "express";
const router = express.Router();
import { pool } from "../db.js";
// Ruta POST para insertar datos de los sensores en la base de datos
router.post("/datos", async (req, res) => {
  const { sensores } = req.body;
  // Ejemplo esperado:
  // { sensores: { sensor1: [25.3, 26.1, 24.8], sensor2: [42.1, 41.8, 43.0] } }

  if (!sensores || typeof sensores !== "object") {
    return res
      .status(400)
      .json({
        error:
          "Formato de datos inválido. Se esperaba un objeto con arreglos de sensores.",
      });
  }

  try {
    const values = [];

    // Iterar sobre cada sensor y sus datos
    for (const [nombre, datos] of Object.entries(sensores)) {
      if (!Array.isArray(datos)) {
        return res
          .status(400)
          .json({
            error: `El sensor '${nombre}' debe tener un arreglo de datos.`,
          });
      }

      datos.forEach((valor) => {
        if (typeof valor !== "number") {
          throw new Error(
            `El valor '${valor}' del sensor '${nombre}' no es un número válido.`
          );
        }
        values.push([nombre, valor]);
      });
    }

    // Insertar todos los datos en la base de datos
    const query = "INSERT INTO datos_sensores (sensor, valor) VALUES ?";
    await pool.query(query, [values]);

    res.json({ message: "Datos registrados correctamente", data: sensores });
  } catch (error) {
    console.error("Error al registrar los datos:", error);
    res
      .status(500)
      .json({ error: "No se pudo registrar los datos en la base de datos." });
  }
});

// Ruta GET para procesar datos y devolver resultados calculados
router.get("/procesar", async (req, res) => {
  try {
    const query = "SELECT sensor, valor FROM datos_sensores";
    const [rows] = await pool.query(query);

    if (rows.length === 0) {
      return res.json({ message: "No hay datos registrados." });
    }

    const sensores = {};

    // Agrupar datos por sensor
    rows.forEach(({ sensor, valor }) => {
      if (!sensores[sensor]) sensores[sensor] = [];
      sensores[sensor].push(valor);
    });

    const resultados = {};

    // Aplicar cálculos por sensor
    for (const [sensor, valores] of Object.entries(sensores)) {
      const n = valores.length;
      const promedio = valores.reduce((a, b) => a + b, 0) / n;
      const sumCuadrados = valores.reduce((sum, x) => sum + (x - promedio) ** 2, 0);
      const desviacionEstandar = Math.sqrt(sumCuadrados / n);
      const desviacionCuadraticaMedia = Math.sqrt(sumCuadrados / n);
      const errorProbable = 0.6745 * desviacionEstandar;
      const errorLimite = 0.01 * promedio;

      resultados[sensor] = {
        promedio,
        desviacionEstandar,
        desviacionCuadraticaMedia,
        errorProbable,
        errorLimite,
      };
    }

    res.json(resultados);
  } catch (error) {
    console.error("Error al procesar datos:", error);
    res.status(500).json({ error: "Error interno al procesar los datos." });
  }
});


export default router;
