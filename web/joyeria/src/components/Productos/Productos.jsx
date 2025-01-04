import { useState, useEffect } from "react";
import { ObtenerCategorias } from "./services/ServicesProducts";
import { AgregarProductos } from "./services/ServicesProducts";
import { ObtenerProductos } from "./services/ServicesProducts";
import "./Productos.css"
import "../Modal/ModalProductos.css"

export const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias , setCategorias] = useState([])
  const [isModalOpen , setIsModalOpen] = useState(false)
  const [newProducto , setNewProducto] = useState({
    nombre : '', 
    descripcion: '',
    precio : '',
    id_categoria:'',
    cantidad_disponible: ''
  });
  

  useEffect(() => {
    fetchProductos()
    fetchCategorias()
  }, []);

  const fetchProductos = async() => {
    const data = await ObtenerProductos()
    setProductos(data)
  }

  const fetchCategorias = async() => {
    const data = await ObtenerCategorias()
    setCategorias(data)
  }


  const eliminarProducto = (id) => {
    console.log('Producto con id ${id} eliminado');
  };

  const editarProducto = (id) => {
    // Aquí puedes agregar la lógica para editar un producto, redirigiendo a una página de edición o abriendo un modal
    console.log('Producto con id ${id} para editar');
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
    setNewProducto({ nombre : '', descripcion: '',precio : '',id_categoria:'',cantidad_disponible: ''})
  }

  const ObtenerDatosProducto = (e) => {
    const {name , value} = e.target
    setNewProducto((prevProducto)=>({...prevProducto,[name]:value,}))
  }

  const validarFormulario = () => {
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
  
  const EnviarForm = () => {
    if (!validarFormulario()) return;
  
    const ProductoValido = {
      ...newProducto,
      precio: Number(newProducto.precio),
      id_categoria: Number(newProducto.id_categoria),
      cantidad_disponible: Number(newProducto.cantidad_disponible),
    };
  
    if (productos.find((producto) => producto.nombre === ProductoValido.nombre)) {
      alert("El producto que deseas agregar ya existe");
      return;
    }
  
    AgregarProductos(ProductoValido)
      .then(() => {
        toggleModal();
        getProductos();
      })
      .catch((error) => {
        console.error("Error al agregar producto", error);
        alert("Hubo un problema al querer agregar el producto");
      });
  };
  

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
              <input type="text" name='nombre'placeholder="Nombre del Producto" value={newProducto.nombre} onChange={ObtenerDatosProducto} />
              <input type="text" name="descripcion" placeholder="Descripcion (Opcional)" value={newProducto.descripcion} onChange={ObtenerDatosProducto} />
              <input type="Number" name="precio" placeholder="Precio" value={newProducto.precio} onChange={ObtenerDatosProducto} />

              <select name='id_categoria'value={newProducto.id_categoria} onChange={ObtenerDatosProducto}>
                <option>Elige una categoria</option>
                {categorias.length > 0 ? (
                  categorias.map((cat) => {
                    return (
                      <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre_categoria}</option>
                    );
                  })
                ) : (<option disabled>Cargando categorias....</option>)}
              </select>

              <input type="Number" name="cantidad_disponible" placeholder="Cantidad " value={newProducto.cantidad_disponible} onChange={ObtenerDatosProducto}/>
              <button onClick={EnviarForm}>Guardar</button>
              <button onClick={toggleModal}>Cerrar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};