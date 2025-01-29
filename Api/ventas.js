import express from 'express'
import {db} from "./db.js"

import { validarID , verificarValidaciones , validarVenta} from './validaciones.js'

export const VentasRouter = express.Router()

VentasRouter.get("/" ,async(req , res) => {
    try{
        const [ ventas ] = await db.query('SELECT * FROM detalle_ventas d JOIN productos p ON d.id_producto = p.id_producto  ')
        res.status(200).send(ventas)

    }catch(error){
        res.status(500).send({mensaje : 'No llegaron las ventas'})
    }
})

VentasRouter.post('/', [validarVenta , verificarValidaciones] , async(req , res ) =>{
    try{
        const {id_producto , cantidad_vendida ,  precio_unitario } = req.body

        const fecha = new Date()

        const [productos] = await db.query('SELECT cantidad_disponible FROM productos WHERE id_producto = ?' , [id_producto])

        if (productos.length === 0) {
            return res.status(404).send({ mensaje: 'Producto no encontrado' });
        }

        const cantidad_disponible = productos[0].cantidad_disponible

        const NuevaCantidad = cantidad_disponible - cantidad_vendida

        const [NuevaVenta] = await db.query('INSERT INTO detalle_ventas (id_producto , cantidad_vendida , precio_unitario , fecha_venta) VALUES(? , ? , ? , ?)',
            [id_producto , cantidad_vendida , precio_unitario , fecha]
        )

        const [NuevoStock] = await db.query('UPDATE productos SET cantidad_disponible = ? where id_producto = ?' , [NuevaCantidad , id_producto])
        
        res.status(200).send({mensaje : 'venta concretada con exito', NuevaVenta , NuevoStock})
    }catch(err){
        res.status(500).send({mensaje: 'Algo salio mal en el back' , err})
    }
})


VentasRouter.delete('/:id',[validarID , verificarValidaciones] ,async(req,res) => {
    try{
        const { id } =  req.params

        const [ ventas ] = await db.query('SELECT * FROM detalle_ventas d JOIN productos p ON d.id_producto = p.id_producto  ')

        console.log(ventas.cantidad_disponible)

        await db.query('DELETE FROM detalle_ventas WHERE id_detalle_venta = ? ', [ id ] )



        res.status(200).send({mensaje : 'Venta borrada con exito'})

    }catch(err){
        res.status(500).send({mensaje : 'Error al borrar una venta' , err})
    }
})

VentasRouter.put('/:id' , [validarID , validarVenta ,verificarValidaciones] , async(req,res) => {
    try{
        const { id } = req.params
        const {id_producto , cantidad_vendida , precio_unitario} = req.body 

        const [producto] = await db.query('SELECT cantidad_disponible FROM productos where id_producto = ?' , [id_producto])
        if(producto.length === 0){
            res.status(404),send({mensaje : 'No se encontro la cantidad del producto'})
        }
        const cantidad_disponible = producto[0].cantidad_disponible
        const NuevaCantidad = cantidad_disponible - cantidad_vendida

        const fecha = new Date()
        const [ActualizarStock] = await db.query('UPDATE productos SET cantidad_disponible = ? where id_producto = ?' , [NuevaCantidad , id_producto])
        const [ActualizarVenta] = await db.query('UPDATE detalle_ventas SET cantidad_vendida = ? , precio_unitario = ? , fecha_venta = ? WHERE id_detalle_venta = ? ' , [cantidad_vendida, precio_unitario , fecha ,id])

        res.status(200).send({mensaje : 'Producto actualizado' , ActualizarVenta , ActualizarStock})
    }catch(err){
        res.status(500),send({mensaje : 'Eror en el back' , err})
    }
})