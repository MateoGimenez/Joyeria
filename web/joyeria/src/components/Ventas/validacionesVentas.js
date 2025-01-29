
export const validarNuevaVenta = (newVenta , listaVentas) => {
    if( !newVenta.id_producto || newVenta.id_producto <= 0 ){
        alert('Se debe agregar un id valido')
        return false
    }

    if(listaVentas.find((producto) => producto.id_producto !== newVenta.id_producto)){
        alert('No se encontro el producto con ese id')
        return false
    }

    if(!newVenta.cantidad_vendida || newVenta.cantidad_vendida <= 0){
        alert('Agregue una cantidad valdia')
        return false
    }

    if(!newVenta.precio_unitario || newVenta.precio_unitario <= 0){
        alert('El producto no tiene un precio establecido')
    }

    
    return true
}