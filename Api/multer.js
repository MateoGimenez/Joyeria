import multer from 'multer';
import path from 'path';

// Configuración del almacenamiento para Multer
const storage = multer.diskStorage({
  destination: 'public/uploads', // Directorio donde se guardarán los archivos
  filename: (req, file, cb) => {
    // Generar un nombre único para el archivo
    const uniqueSuffix = Date.now() + '--' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // Obtener la extensión del archivo
    cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Crear el nombre del archivo
  },
});

// Exportar el middleware para subir archivos
export const upload = multer({ storage });
