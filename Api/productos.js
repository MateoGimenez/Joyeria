import express from 'express'
import {db} from './db.js'
import { validarID , validarProducto, verificarValidaciones } from './validaciones.js'

export const ProductosRouter = express.Router()

// Traer todos los productos 
ProductosRouter.get('/', async(req,res)=> {
    try{
        const [Productos] = await db.query('SELECT * FROM productos')
        res.status(200).send(Productos)
    }catch(error){
        res.status(500).send({mensaje : 'No llegaron los productos'})
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
ProductosRouter.post('/',[validarProducto , verificarValidaciones] ,async(req,res)=> {
    const {nombre , descripcion, precio , id_categoria,cantidad_disponible} = req.body

    const fecha_agregado = new Date()

    try{
        const [NuevoProducto] = await db.query('INSERT INTO productosa (nombre , descripcion, precio , id_categoria,cantidad_disponible,fecha_agregado) VALUES(? , ? , ? , ? , ? , ?)', [nombre , descripcion, precio , id_categoria,cantidad_disponible,fecha_agregado])

        res.status(200).send({mensaje : 'Nuevo producto agregado' , NuevoProducto})
    }catch(error){
        res.status(500).send({mensaje : 'error al agregar un producto'})
    }
})

//Borrar productosd
ProductosRouter.delete("/:id",[validarID, verificarValidaciones] ,async(req,res)=> {
    const { id } = req.params
    try{
        await db.query('DELETE FROM productos WHERE id_producto = ? ' , [id])
        res.status(200).send({mensaje : "Se borro el Producto con el id "  [id]})
    }catch(error){
        res.status(500).send({mensaje : 'Error en elminar productos'})
    }
})

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
