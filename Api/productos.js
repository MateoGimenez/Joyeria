import express from 'express'
import {db} from './db.js'
import { validarID , validarProducto, verificarValidaciones } from './validaciones.js'
import { upload } from './upload.js'

export const ProductosRouter = express.Router()

// Traer todos los productos 
ProductosRouter.get('/', async (req, res) => {
    try {
        const [Productos] = await db.query('SELECT * FROM productos');
        const productosConImagenes = Productos.map((producto) => ({
            ...producto,
            imagen: producto.imagen
                ? `http://localhost:3000${producto.imagen}` // Ruta completa
                : null,
        }));
        res.status(200).send(productosConImagenes);
    } catch (error) {
        res.status(500).send({ mensaje: 'No llegaron los productos' });
    }
});


//Obtener las categorias de los productos
ProductosRouter.get('/categorias', async(req,res)=>{
    try{
        const [Categorias] = await db.query('SELECT * FROM categorias')
        res.status(200).send(Categorias)
    }catch(error){ 
        res.status(500).send({mensaje : 'No llegaron las categorias'})
    }
})

//Buscar producto por id 
ProductosRouter.get("/:id" , [validarID , verificarValidaciones ], async(req,res) => {
    const { id } = req.params
    try{
        const [Productos] = await db.query('SELECT * FROM productos WHERE id_producto = ?' , [ id ])
        if(Productos.length === 0){
            return res.status(404).send({mensaje : 'Producto no encontrado'})
        }
        res.status(200).send(Productos)
    }catch(error){
        res.status(500).send({mensaje : 'No llegaron los productos'})
    }
})

//Agregar productos
ProductosRouter.post('/', [upload.single('imagen'), validarProducto, verificarValidaciones],
    async (req, res) => {
        const { nombre, descripcion, precio, id_categoria, cantidad_disponible } = req.body;

        const fecha_agregado = new Date();
        const imagen = req.file ? `/uploads/${req.file.filename}` : null; // Ruta de la imagen subida
        try {
            const [NuevoProducto] = await db.query(
                'INSERT INTO productos (nombre, descripcion, precio, id_categoria, cantidad_disponible, fecha_agregado, imagen_url) VALUES(?, ?, ?, ?, ?, ?, ?)',
                [nombre, descripcion, precio, id_categoria, cantidad_disponible, fecha_agregado, imagen]
            );

            res.status(200).send({
                mensaje: 'Nuevo producto agregado',
                producto: {
                    id: NuevoProducto.insertId,
                    nombre,
                    descripcion,
                    precio,
                    id_categoria,
                    cantidad_disponible,
                    fecha_agregado,
                    imagen_url: imagen 
                },
            });
        } catch (error) {
            console.error(error); // Log de error adicional para depurar
            res.status(500).send({ mensaje: 'Error al agregar un producto', error });
        }
    }
);


//Borrar productosd
ProductosRouter.delete("/:id", [validarID, verificarValidaciones], async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM productos WHERE id_producto = ? ', [id]);
        res.status(200).send({ mensaje: `Se borró el Producto con el id ${id}` });
    } catch (error) {
        res.status(500).send({ mensaje: 'Error en eliminar productos' });
    }
});


//actualizar productos x id
ProductosRouter.put('/:id', [validarProducto, validarID, verificarValidaciones], async (req, res) => {
    const { nombre, descripcion, precio, id_categoria, cantidad_disponible } = req.body;
    const { id } = req.params; // Extraemos el id de los parámetros de la URL.

    try {
        // Realizamos la actualización del producto en la base de datos.
        const [result] = await db.query(
            'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, id_categoria = ?, cantidad_disponible = ? WHERE id_producto = ?',
            [nombre, descripcion, precio, id_categoria, cantidad_disponible, id]
        );

        // Si no se encuentra el producto, el número de filas afectadas será 0.
        if (result.affectedRows === 0) {
            return res.status(404).send({ mensaje: 'Producto no encontrado' });
        }

        res.status(200).send({ mensaje: 'Producto actualizado exitosamente' });
    } catch (error) {
        res.status(500).send({ mensaje: 'Error al actualizar el producto', error });
    }
});
