import { useCategorias } from "../hooks/useCategorias";
import { NumericFormat } from "react-number-format";
import './ModalProductos.css'

export const Modal = ({ isModalOpen, toggleModal, newProducto, ObtenerDatosProducto, EnviarForm ,productoEditando , ActulizarProductosEditado}) => {

  const categoriasList = useCategorias()


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

          <NumericFormat
            value={newProducto.precio}
            thousandSeparator={true}
            decimalScale={2}
            fixedDecimalScale={true}
            prefix={"$"}
            name="precio"
            placeholder="Precio"
            onValueChange={(values) => {
              const { value } = values;
              ObtenerDatosProducto({ target: { name: "precio", value } });
            }}
          />

          <select
            name="id_categoria"
            value={newProducto.id_categoria}
            onChange={ObtenerDatosProducto}
          >
            <option value={""}>Elige una categoría</option>
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

          <NumericFormat
            value={newProducto.cantidad_disponible}
            thousandSeparator={true}
            allowNegative={false}
            name="cantidad_disponible"
            placeholder="Cantidad"
            onValueChange={(values) => {
              const { value } = values;
              ObtenerDatosProducto({ target: { name: "cantidad_disponible", value } });
            }}
          />

          <input
            type="file"
            name="image"  
            id="imagenProducto"
            accept="image/*"
            onChange={ObtenerDatosProducto}
          />


          <button type="button" onClick={productoEditando? ActulizarProductosEditado : EnviarForm}>{productoEditando ? 'actualizar' : 'Guardar'}</button>
          <button type="button" onClick={toggleModal}>Cerrar</button>
        </form>
      </div>
    </div>
  );
};
