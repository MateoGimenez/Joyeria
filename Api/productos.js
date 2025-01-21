import express from 'express'
import {db} from './db.js'
import { validarID , validarProducto, verificarValidaciones } from './validaciones.js'
import { upload } from './multer.js'

export const ProductosRouter = express.Router()

// Traer todos los productos 
ProductosRouter.get('/', async (req, res) => {
    try {
        const [Productos] = await db.query('SELECT * FROM productos');
        // Construir URL completa
        const ProductosConURLCompleta = Productos.map((producto) => ({
            ...producto,
            imagen_url: `${req.protocol}://${req.get('host')}${producto.imagen_url}`, // Concatenar el host con la ruta relativa
            //req.protocol: Obtiene el protocolo del servidor (http o https).
            //req.get("host"): Obtiene el host (dominio o IP y puerto) del servidor
            //producto.imagen_url: Contiene la ruta relativa /uploads/....
        }));

        res.status(200).send(ProductosConURLCompleta);
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
ProductosRouter.post('/', upload.single('image') , validarProducto, verificarValidaciones, async (req, res) => {
    const { nombre, descripcion, precio, id_categoria, cantidad_disponible } = req.body;

    const fecha_agregado = new Date();
    console.log("Body recibido:", req.body);
    console.log("Archivo recibido:", req.file);

    try {
        if(!req.file){
            return res.status(400).send({error : 'No se subio ningun archivo file'})
        }

        const imageUrl = `/uploads/${req.file.filename}`; // Ruta relativa del archivo

        const [NuevoProducto] = await db.query(
            'INSERT INTO productos (nombre, descripcion, precio, id_categoria, cantidad_disponible, fecha_agregado, imagen_url) VALUES(?, ?, ?, ?, ?, ?, ?)',
            [nombre, descripcion, precio, id_categoria, cantidad_disponible, fecha_agregado , imageUrl]
        );

        res.status(200).send({
            mensaje: 'Nuevo producto agregado',
            producto: {id: NuevoProducto.insertId, nombre, descripcion, precio,id_categoria,cantidad_disponible,fecha_agregado, imageUrl }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ mensaje: 'Error al agregar un producto', error });
    }
});



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


// Actualizar productos por id
ProductosRouter.put('/:id', [validarProducto, validarID, verificarValidaciones], async (req, res) => {
    const { nombre, descripcion, precio, id_categoria, cantidad_disponible, imagen_url } = req.body;
    const { id } = req.params; // Extraemos el id de los parámetros de la URL.

    try {
        // Si no se envía una nueva imagen, usamos el valor actual en la base de datos (o null si no existe).
        const [productoActual] = await db.query('SELECT imagen_url FROM productos WHERE id_producto = ?', [id]);
        
        const imagen = imagen_url || productoActual[0]?.imagen_url; // Si no hay imagen nueva, usamos la existente.

        // Realizamos la actualización del producto en la base de datos.
        const [result] = await db.query(
            'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, id_categoria = ?, cantidad_disponible = ?, imagen_url = ? WHERE id_producto = ?',
            [nombre, descripcion, precio, id_categoria, cantidad_disponible, imagen, id]
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

