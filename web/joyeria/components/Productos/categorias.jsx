
export const ObtenerCategorias = async() => {
    try{
        const res = await fetch('http://localhost:3000/productos/categorias')
        const data = await res.json()
        return data
    }catch(error){
        console.error('Error al traer las categorias de la base de datos')
    }
}