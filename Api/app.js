import express from 'express'
import cors from 'cors'
import { conectarDB } from './db.js'
import { ProductosRouter } from './productos.js'
import { VentasRouter } from './ventas.js'


const app = express()
const port = 3000

try{
    conectarDB()
    console.log('conectada exitosmanete')
}catch(error){
    console.error('Error al conectar con la base de datos' , error)
    process.exit(1) //Finaliza la app 
}

app.use(express.json());
app.use(cors());

app.use('/productos', ProductosRouter)

app.use('/ventas',VentasRouter)

app.listen(port, () => {
    console.log(`La aplicacion esta funcionando en: ${port}`)
})