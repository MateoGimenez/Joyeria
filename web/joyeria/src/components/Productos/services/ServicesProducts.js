export const ObtenerProductos = async () => {
    try {
      const res = await fetch("http://localhost:3000/productos");
      const data = await res.json();
      return data 
    } catch (error) {
      console.error("Error al obtener los productos", error);
    }
  };

export const AgregarProductos = async(producto) => {
    try{
        const res = await fetch('http://localhost:3000/productos',{
            method:'POST',
            headers:{"Content-Type" : "application/json"},
            body : JSON.stringify(producto)
        })

        if(!res.ok){
            console.log('Error al intentar agregar el producto desde el post')
            console.log(res)
        }
    }catch(error){
        console.log('Error al intentar agragar un producto desde el post')
    }
}

export const ObtenerCategorias = async() => {
    try{
        const res = await fetch('http://localhost:3000/productos/categorias')
        const data = await res.json()
        return data
    }catch(error){
        console.error('Error al traer las categorias de la base de datos')
    }
}