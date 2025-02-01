
export const validarNuevaVenta = (newVenta , listaProductos) => {
    if( !newVenta.id_producto || newVenta.id_producto <= 0 ){
        alert('Se debe agregar un id valido')
        return false
    }

    if (!listaProductos.some((producto) => producto.id_producto === newVenta.id_producto)) {
        alert('No se encontró el producto con ese ID');
        return false;
    }
    

    if(!newVenta.cantidad_vendida || newVenta.cantidad_vendida <= 0){
        alert('Agregue una cantidad valdia')
        return false
    }

    if(!newVenta.precio_unitario || newVenta.precio_unitario <= 0){
        alert('El producto no tiene un precio establecido')
        return false
    }

    const stock = listaProductos.find((producto) => producto.id_producto === newVenta.id_producto)
    const nuevaCantidad  = stock.cantidad_disponible - newVenta.cantidad_vendida
    if(nuevaCantidad < 0){
        alert('No se puede vender mas cantidad del stock disponible')
        return false
    }
    
    return true
}