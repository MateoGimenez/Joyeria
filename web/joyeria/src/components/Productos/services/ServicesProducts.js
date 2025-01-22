export const ObtenerProductos = async () => {
    try {
      const res = await fetch("http://localhost:3000/productos");
      const data = await res.json();
      return data 
    } catch (error) {
      console.error("Error al obtener los productos", error);
    }
  };

export const AgregarProductos = async (formData) => {
  const response = await fetch("http://localhost:3000/productos", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error desconocido");
  }
  return response.json();
};
  
  

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
  
export const ActualizarProducto = async (id, formData) => {
  try {
    const response = await fetch(`http://localhost:3000/productos/${id}`, {
      method: "PUT",
      body: formData, // FormData para actualizar con imagen incluida
    });

    if (!response.ok) {
      throw new Error("Error al actualizar producto");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
};

  