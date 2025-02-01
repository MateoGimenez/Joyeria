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
        if(NuevaCantidad < 0 ){
            return res.status(404).send({mensaje : 'No se puede vender mas del stock disponible'})
        }

        const [NuevaVenta] = await db.query('INSERT INTO detalle_ventas (id_producto , cantidad_vendida , precio_unitario , fecha_venta) VALUES(? , ? , ? , ?)',
            [id_producto , cantidad_vendida , precio_unitario , fecha]
        )

        const [NuevoStock] = await db.query('UPDATE productos SET cantidad_disponible = ? where id_producto = ?' , [NuevaCantidad , id_producto])
        
        res.status(200).send({mensaje : 'venta concretada con exito', NuevaVenta , NuevoStock})
    }catch(err){
        res.status(500).send({mensaje: 'Algo salio mal en el back' , err})
    }
})


VentasRouter.delete('/:id', [validarID, verificarValidaciones], async (req, res) => {
    try {
        const { id } = req.params;

        const [ventas] = await db.query('SELECT id_producto, cantidad_vendida FROM detalle_ventas WHERE id_detalle_venta = ?', [id]);

        if (ventas.length === 0) {
            return res.status(404).send({ mensaje: 'Venta no encontrada' });
        }

        const { id_producto, cantidad_vendida } = ventas[0];

        // Devolver stock antes de eliminar
        await db.query('UPDATE productos SET cantidad_disponible = cantidad_disponible + ? WHERE id_producto = ?', [cantidad_vendida, id_producto]);

        // Eliminar la venta
        await db.query('DELETE FROM detalle_ventas WHERE id_detalle_venta = ?', [id]);

        res.status(200).send({ mensaje: 'Venta eliminada y stock actualizado' });
    } catch (err) {
        res.status(500).send({ mensaje: 'Error al borrar una venta', err });
    }
});


VentasRouter.put('/:id', [validarID, validarVenta, verificarValidaciones], async (req, res) => {
    try {
        const { id } = req.params;
        const { id_producto, cantidad_vendida, precio_unitario } = req.body;

        // Obtener la venta original
        const [ventaOriginal] = await db.query('SELECT id_producto, cantidad_vendida FROM detalle_ventas WHERE id_detalle_venta = ?', [id]);
        if (ventaOriginal.length === 0) {
            return res.status(404).send({ mensaje: 'Venta no encontrada' });
        }

        const { cantidad_vendida: cantidadAnterior, id_producto: idAnterior } = ventaOriginal[0];

        // Si se cambió el producto, ajustar stock en ambos productos
        if (id_producto !== idAnterior) {
            await db.query('UPDATE productos SET cantidad_disponible = cantidad_disponible + ? WHERE id_producto = ?', [cantidadAnterior, idAnterior]);
            await db.query('UPDATE productos SET cantidad_disponible = cantidad_disponible - ? WHERE id_producto = ?', [cantidad_vendida, id_producto]);
        } else {
            // Ajustar stock en el mismo producto
            const diferencia = cantidadAnterior - cantidad_vendida;
            await db.query('UPDATE productos SET cantidad_disponible = cantidad_disponible + ? WHERE id_producto = ?', [diferencia, id_producto]);
        }

        // Actualizar la venta
        const fecha = new Date();
        await db.query('UPDATE detalle_ventas SET cantidad_vendida = ?, precio_unitario = ?, fecha_venta = ? WHERE id_detalle_venta = ?', [cantidad_vendida, precio_unitario, fecha, id]);

        res.status(200).send({ mensaje: 'Venta actualizada y stock corregido' });
    } catch (err) {
        res.status(500).send({ mensaje: 'Error en el backend', err });
    }
});
