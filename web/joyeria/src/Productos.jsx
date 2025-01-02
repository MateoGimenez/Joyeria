import { useState, useEffect } from "react";
import "./Productos.css"

export const Productos = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    getProductos();
  }, []);

  const getProductos = async () => {
    try {
      const res = await fetch("http://localhost:3000/productos");
      const data = await res.json();
      setProductos(data); // Asegúrate de que 'data' es un array de productos
    } catch (error) {
      console.error("Error al obtener los productos", error);
    }
  };

  const eliminarProducto = (id) => {
    // Aquí puedes agregar la lógica para eliminar un producto, por ejemplo llamando a un endpoint
    // Ejemplo de eliminación:
    setProductos(productos.filter(producto => producto.id_producto !== id));
    console.log(`Producto con id ${id} eliminado`);
  };

  const editarProducto = (id) => {
    // Aquí puedes agregar la lógica para editar un producto, redirigiendo a una página de edición o abriendo un modal
    console.log(`Producto con id ${id} para editar`);
  };

  return (
    <div className="productos-contenedor">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Cantidad Disponible</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length > 0 ? (
            productos.map((producto) => (
              <tr key={producto.id_producto}>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>{producto.precio}</td>
                <td>{producto.cantidad_disponible}</td>
                <td>
                  <button onClick={() => editarProducto(producto.id_producto)}>Editar</button>
                  <button onClick={() => eliminarProducto(producto.id_producto)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No hay productos disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
