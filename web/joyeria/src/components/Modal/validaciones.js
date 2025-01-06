
export const validarFormulario = (newProducto) => {
    if (!newProducto.nombre.trim()) {
      alert("El nombre es obligatorio");
      return false;
    }
    if (isNaN(newProducto.precio) || newProducto.precio <= 0) {
      alert("El precio debe ser un número positivo");
      return false;
    }
    if (!newProducto.id_categoria) {
      alert("Selecciona una categoría válida");
      return false;
    }

    return true;
  };
  