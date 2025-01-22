export const validarFormulario = (newProducto, listaProductos) => {
  if (!newProducto.nombre.trim()) {
    alert("El nombre es obligatorio");
    return false;
  }
  if (listaProductos.find((producto) => producto.nombre === newProducto.nombre)) {
    alert("El producto con ese Nombre ya existe en la lista de Productos");
    return false; // Asegúrate de detener la ejecución aquí
  }
  if (isNaN(newProducto.precio) || newProducto.precio <= 0) {
    alert("El precio debe ser un número positivo");
    return false;
  }
  if (!newProducto.id_categoria) {
    alert("Selecciona una categoría válida");
    return false;
  }

  if(!newProducto.imagen_url){
    alert('Seleccione el imagen del producto')
    return false
  }
  return true;
};
