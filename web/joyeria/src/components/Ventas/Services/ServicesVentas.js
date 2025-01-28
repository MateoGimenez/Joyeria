
export const ObtenerVentas = async () => {
    try{
        const res = await fetch('http://localhost:3000/ventas')
        const data = await res.json()
        return data
    }catch(error){
        console.log('Error al obtener las ventas',error)
    }
}

export const AgregarVentas = async(NewVenta) => {
    const res  = await fetch("http://localhost:3000/ventas" ,{
        method: 'POST',
        body: NewVenta,
    })
    if(res.ok){
        const errordata = await res.json()
        throw new Error(errordata.error|| 'Error en agregarVentas') 
    }

    return res.json()
}