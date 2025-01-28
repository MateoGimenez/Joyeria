import express from 'express'
import {db} from "./db.js"

export const VentasRouter = express.Router()

VentasRouter.get("/" ,async(req , res) => {
    try{
        const [ ventas ] = await db.query('SELECT * FROM detalle_ventas d JOIN productos p ON d.id_producto = p.id_producto  ')
        res.status(200).send(ventas)
    }catch(error){
        res.status(500).send({mensaje : 'No llegaron las ventas'})
    }
})

VentasRouter.post('/',async(req , res ) =>{
    try{
        const {id_producto , cantidad_vendida ,  precio_unitario } = req.body

        const fecha = new Date()

        const [NuevaVenta] = await db.query('INSERT INTO detalle_ventas (id_producto , cantidad_vendida , precio_unitario , fecha_venta) VALUES(? , ? , ? , ?)',
            [id_producto , cantidad_vendida , precio_unitario , fecha]
        )

        res.status(200).send({mensaje : 'venta concretada con exito', NuevaVenta})
    }catch(err){
        res.status(500).send({mensaje: 'Algo salio mal en el back'})
    }
})
