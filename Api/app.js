import express from "express";
import cors from "cors";
import { conectarDB } from "./db.js";
import { ProductosRouter } from "./productos.js";
import { VentasRouter } from "./ventas.js";
import { fileURLToPath } from 'url';  
import { dirname } from 'path'; 

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


app.use('/uploads', express.static('public/uploads'));


app.listen(port, () => {
  console.log(`La aplicación está funcionando en: http://localhost:${port}`);
});
