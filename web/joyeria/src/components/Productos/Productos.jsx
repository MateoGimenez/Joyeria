import { useEffect, useState } from "react";
import { AgregarProductos } from "./services/ServicesProducts";
import { ObtenerProductos } from "./services/ServicesProducts";
import { EliminarProductos } from "./services/ServicesProducts";
import { ActualizarProducto } from "./services/ServicesProducts";
import { useCategorias } from "../hooks/useCategorias";
import { CategoriaSelect } from "../CategoriasSelect";
import { Modal } from "../Modal/Modal";
import { validarFormulario } from "../Modal/validaciones";
import "./Productos.css";
import "../Modal/ModalProductos.css";

export const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProducto, setNewProducto] = useState({nombre: "",descripcion: "",precio: "",id_categoria: "",cantidad_disponible: "",imagen_url:''});
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
    const confirmar = window.confirm("¿Deseas eliminar el producto?");
    if (!confirmar) return;

    try {
      await EliminarProductos(id);
      setProductos((prevProductos) =>prevProductos.filter((producto) => producto.id_producto !== id));
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
      });
      toggleModal();
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (isModalOpen) {
      setProductoEditando(null);
      setNewProducto({nombre: "",descripcion: "",precio: "", id_categoria: "",cantidad_disponible: "",});
    }
  };

  const ObtenerDatosProducto = (e) => {
    const { name, value } = e.target;
    setNewProducto((prevProducto) => ({ ...prevProducto, [name]: value }));
  };

  const EnviarForm = () => {
    if (!validarFormulario(newProducto)) return;

    const ProductoValido = {
      ...newProducto,
      precio: Number(newProducto.precio),
      id_categoria: Number(newProducto.id_categoria),
      cantidad_disponible: Number(newProducto.cantidad_disponible),
    };

    if (productos.find((producto) =>producto.nombre === ProductoValido.nombre &&producto.id_producto !== ProductoValido.id_producto)) {
      alert("El producto que deseas agregar ya existe");
      return;
    }

    if (productoEditando) {
      ActualizarProducto(ProductoValido)
        .then(() => {
          toggleModal();
          setProductoEditando(null);
        })
        .catch((error) => {
          console.error("Error al actualizar producto", error);
          alert("Hubo un problema al querer actualizar el producto");
        });
    } else {
      AgregarProductos(ProductoValido)
        .then(() => {
          toggleModal();
        })
        .catch((error) => {
          console.error("Error al agregar producto", error);
          alert("Hubo un problema al querer agregar el producto");
        });
    }
  };

  // Funciones de búsqueda y filtrado
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
                <td>{producto.imagen_url}</td>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>${producto.precio}</td>
                <td>{producto.cantidad_disponible}</td>
                <td>
                  <button onClick={() => editarProducto(producto.id_producto)}>
                    ✏️
                  </button>
                  <button
                    onClick={() => fetcEliminarProducto(producto.id_producto)}
                  >
                    🗑️
                  </button>
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
