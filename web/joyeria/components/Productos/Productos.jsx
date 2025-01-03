import { useState, useEffect } from "react";
import { ObtenerCategorias } from "./categorias";
import "./Productos.css"
import "./agregarProductos.css"
import { use } from "react";

export const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias , setCategorias] = useState([])
  const [isModalOpen , setIsModalOpen] = useState(false)
  const [newProducto , setNewProducto] = useState({
    nombre : '', 
    descripcion: '',
    precio : 0,
    id_categoria:0,
    cantidad_disponible: 0
  });
  

  useEffect(() => {
    getProductos();
    fetchCategorias()
  }, []);

  const fetchCategorias = async() => {
    const data = await ObtenerCategorias()
    setCategorias(data)
  }


  const getProductos = async () => {
    try {
      const res = await fetch("http://localhost:3000/productos");
      const data = await res.json();
      setProductos(data); 
    } catch (error) {
      console.error("Error al obtener los productos", error);
    }
  };

  const eliminarProducto = (id) => {
    console.log(`Producto con id ${id} eliminado`);
  };

  const editarProducto = (id) => {
    // Aquí puedes agregar la lógica para editar un producto, redirigiendo a una página de edición o abriendo un modal
    console.log(`Producto con id ${id} para editar`);
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen)

  const ObtenerDatosProducto = (e) => {
    const {name , value} = e.target
    setNewProducto((prevProducto)=>({...prevProducto,[name]:value,}))
  }

  return (
    <div className="productos-contenedor">
      <div className="acciones">
        <div className="contenedor-buscar">
          <input placeholder="Buscar" className="inputbuscar" />
          <button className="buscar">Buscar</button>
        </div>
        <div className="contenedor-agregar">
          <button className="agregar" onClick={toggleModal}>Agregar</button>
        </div>
      </div>
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
                  <button onClick={() => editarProducto(producto.id_producto)}>✏️</button>
                  <button onClick={() => eliminarProducto(producto.id_producto)}>🗑️</button>
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

      {isModalOpen &&(
        <div className="modal-overlay" >
          <div className="modal" onClick={(e)=>e.stopPropagation()}>
            <form onSubmit={(e)=> e.preventDefault()}>
              <h2>Agregar Producto</h2>
              <input type="text" placeholder="Nombre" value={newProducto.nombre} onChange={ObtenerDatosProducto} />
              <input type="text" placeholder="Descripcion (Opcional)" value={newProducto.descripcion} onChange={ObtenerDatosProducto} />
              <input type="Number" placeholder="Precio" value={newProducto.precio} onChange={ObtenerDatosProducto} />

              <select name='id_categoria'value={newProducto.id_categoria} onChange={ObtenerDatosProducto}>
                {categorias.length > 0 ? (
                  categorias.map((cat) => {
                    return (
                      <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre_categoria}</option>
                    );
                  })
                ) : (<option disabled>Cargando categorias....</option>)}
              </select>
              
              <input type="Number" placeholder="Cantidad" value={newProducto.cantidad_disponible} onChange={ObtenerDatosProducto}/>
              <button>Agregar</button>
              <button onClick={toggleModal}>Cerrar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
