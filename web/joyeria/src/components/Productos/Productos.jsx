import { useEffect, useState } from "react";
import {AgregarProductos,ObtenerProductos,EliminarProductos,ActualizarProducto} from "./services/ServicesProducts";
import { useCategorias } from "../hooks/useCategorias";
import { CategoriaSelect } from "../CategoriasSelect";
import { Modal } from '../Modal/Modal.jsx'
import { validarFormulario } from "../Modal/validacionesModal.js";
import "./Productos.css";


export const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProducto, setNewProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    id_categoria: "",
    cantidad_disponible: "",
    imagen_url: null,
  });
  const [productoEditando, setProductoEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");

  const categoriasList = useCategorias();

  useEffect(() => {
    const fetchProductos = async () => {
      const data = await ObtenerProductos();
      setProductos(data);
    };
    fetchProductos();
  }, []);

  const fetcEliminarProducto = async (id) => {
    const confirmar =  window.confirm("¿Deseas eliminar el producto?");
    if (!confirmar) return;

    try {
      await EliminarProductos(id);
      setProductos((prevProductos) =>
        prevProductos.filter((producto) => producto.id_producto !== id)
      );
    } catch (error) {
      alert("Hubo un problema al intentar eliminar el producto.");
    }
  };

  const editarProducto = (id) => {
    const productoAEditar = productos.find((producto) => producto.id_producto === id);

    if (productoAEditar) {
      setProductoEditando(productoAEditar);
      setNewProducto({
        id_producto: productoAEditar.id_producto,
        nombre: productoAEditar.nombre,
        descripcion: productoAEditar.descripcion,
        precio: productoAEditar.precio,
        id_categoria: productoAEditar.id_categoria,
        cantidad_disponible: productoAEditar.cantidad_disponible,
        imagen_url: null, // Resetear imagen para evitar confusión
      });
      toggleModal();
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (isModalOpen) {
      setProductoEditando(null);
      setNewProducto({
        nombre: "",
        descripcion: "",
        precio: "",
        id_categoria: "",
        cantidad_disponible: "",
        imagen_url: null,
      });
    }
  };

  const ObtenerDatosProducto = (e) => {
    const { name, value, files } = e.target;
  
    if (name === 'image') {
      // Si es el campo de la imagen, guardamos el archivo en el estado
      setNewProducto((prev) => ({
        ...prev,
        imagen_url: files[0],  // Almacenamos el archivo
      }));
    } else {
      // Para otros campos
      setNewProducto((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  

  const EnviarForm = async () => {
    if (!validarFormulario(newProducto)) return;
  
    const formData = new FormData();
    formData.append("nombre", newProducto.nombre);
    formData.append("descripcion", newProducto.descripcion || "");
    formData.append("precio", Number(newProducto.precio));
    formData.append("id_categoria", Number(newProducto.id_categoria));
    formData.append("cantidad_disponible", Number(newProducto.cantidad_disponible));
  
    // Si hay un archivo de imagen, lo agregamos al FormData
    if (newProducto.imagen_url) {
      formData.append("image", newProducto.imagen_url);  // Asegúrate de que sea "image"
    }
  
    try {
      if (productoEditando) {
        await ActualizarProducto(productoEditando.id_producto, formData);
      } else {
        await AgregarProductos(formData);
      }
      toggleModal();
      const data = await ObtenerProductos();
      setProductos(data);
    } catch (error) {
      alert("Hubo un problema al intentar guardar el producto.");
      console.error(error);
    }
  };
  
  
  

  const manejarBusqueda = (e) => {
    setBusqueda(e.target.value.toLowerCase());
  };

  const manejarFiltroCategoria = (e) => {
    setFiltroCategoria(e.target.value);
  };

  const productosFiltrados = productos.filter((producto) => {
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda);
    const coincideCategoria =
      filtroCategoria === "" || producto.id_categoria === parseInt(filtroCategoria);
    return coincideBusqueda && coincideCategoria;
  });

  return (
    <div className="productos-contenedor">
      <div className="acciones">
        <div className="contenedor-buscar">
          <input
            placeholder="Buscar"
            className="inputbuscar"
            value={busqueda}
            onChange={manejarBusqueda}
          />
          <CategoriaSelect
            categorias={categoriasList}
            value={filtroCategoria}
            onChange={manejarFiltroCategoria}
          />
        </div>
        <div className="contenedor-agregar">
          <button className="agregar" onClick={toggleModal}>
            Agregar
          </button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Cantidad Disponible</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((producto) => (
              <tr key={producto.id_producto}>
                <td>
                  {producto.imagen_url ? (
                    <img
                      src={producto.imagen_url}
                      className="imagen-producto"
                    />
                  ) : (
                    "Sin imagen"
                  )}
                </td>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>${producto.precio}</td>
                <td>{producto.cantidad_disponible}</td>
                <td>
                  <button onClick={() => editarProducto(producto.id_producto)}>✏️</button>
                  <button onClick={() => fetcEliminarProducto(producto.id_producto)}>🗑️</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No hay productos disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
      <Modal
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        newProducto={newProducto}
        ObtenerDatosProducto={ObtenerDatosProducto}
        EnviarForm={EnviarForm}
      />
    </div>
  );
};
