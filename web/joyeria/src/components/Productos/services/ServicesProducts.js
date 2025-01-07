export const ObtenerProductos = async () => {
    try {
      const res = await fetch("http://localhost:3000/productos");
      const data = await res.json();
      console.log(data)
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
};

export const EliminarProductos = async (id_producto) => {
    try {
      const res = await fetch(`http://localhost:3000/productos/${id_producto}`, {
        method: "DELETE",
      });
  
      if (res.ok) {
        alert("El producto fue eliminado correctamente");

      } else {
        alert("No se pudo eliminar el producto. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error en el delete service", error);
      alert("Hubo un error en la comunicación con el servidor.");
    }
  };
  
export const ActualizarProducto = async (producto) => {
    try {
      const res = await fetch(`http://localhost:3000/productos/${producto.id_producto}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          id_categoria: producto.id_categoria,
          cantidad_disponible: producto.cantidad_disponible,
        }),
      });
  
      if (res.ok) {
        alert("El producto fue actualizado correctamente");
      } else {
        alert("No se pudo actualizar el producto. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error en el put service", error);
      alert("Hubo un error en la comunicación con el servidor.");
    }
  };
  