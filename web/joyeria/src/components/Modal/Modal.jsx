// src/components/Modal.jsx

import { useEffect, useState } from "react";
import { ObtenerCategorias } from "../Productos/services/ServicesProducts";

export const Modal = ({ isModalOpen, toggleModal, newProducto, ObtenerDatosProducto, EnviarForm }) => {
  const [categoriasList, setCategoriasList] = useState([]);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    const data = await ObtenerCategorias();
    setCategoriasList(data);
  };

  if (!isModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={toggleModal}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={(e) => e.preventDefault()}>
          <h2>Agregar Producto</h2>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del Producto"
            value={newProducto.nombre}
            onChange={ObtenerDatosProducto}
          />
          <input
            type="text"
            name="descripcion"
            placeholder="Descripción (Opcional)"
            value={newProducto.descripcion}
            onChange={ObtenerDatosProducto}
          />
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={newProducto.precio}
            onChange={ObtenerDatosProducto}
          />
          <select
            name="id_categoria"
            value={newProducto.id_categoria}
            onChange={ObtenerDatosProducto}
          >
            <option>Elige una categoría</option>
            {categoriasList.length > 0 ? (
              categoriasList.map((cat) => (
                <option key={cat.id_categoria} value={cat.id_categoria}>
                  {cat.nombre_categoria}
                </option>
              ))
            ) : (
              <option disabled>Cargando categorías...</option>
            )}
          </select>
          <input
            type="number"
            name="cantidad_disponible"
            placeholder="Cantidad"
            value={newProducto.cantidad_disponible}
            onChange={ObtenerDatosProducto}
          />
          <button onClick={EnviarForm}>Guardar</button>
          <button onClick={toggleModal}>Cerrar</button>
        </form>
      </div>
    </div>
  );
};
