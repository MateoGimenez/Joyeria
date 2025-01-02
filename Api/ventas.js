import express from 'express'
import {db} from "./db.js"

export const VentasRouter = express.Router()

VentasRouter.get("/" ,async(req , res) => {
    try{
        const [ ventas ] = await db.query('SELECT * FROM detalle_ventas ')
        res.status(200).send(ventas)
    }catch(error){
        res.status(500).send({mensaje : 'No llegaron las ventas'})
    }
})

