import express from "express";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import { conectarDB } from "./db.js";
import { ProductosRouter } from "./productos.js";
import { VentasRouter } from "./ventas.js";
import { ImagenesRouter } from "./imagenes.js"

const app = express();
const port = 3000;

try {
  conectarDB();
  console.log("Conectada exitosamente");
} catch (error) {
  console.error("Error al conectar con la base de datos", error);
  process.exit(1); // Finaliza la app
}

app.use(express.json());
app.use(cors());

app.use("/productos", ProductosRouter);
app.use("/ventas", VentasRouter);

app.use("/imagenes", ImagenesRouter); 

// Definir __dirname manualmente en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'))); // Servir imágenes estáticas

app.listen(port, () => {
  console.log(`La aplicación está funcionando en: http://localhost:${port}`);
});
