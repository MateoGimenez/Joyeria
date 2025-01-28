import { useState, useEffect } from "react";
import { CategoriaSelect } from "../CategoriasSelect";
import { useCategorias } from "../hooks/useCategorias";
import { ObtenerVentas, AgregarVentas } from "./Services/ServicesVentas";
import { validarNuevaVenta } from "./validacionesVentas";
import "./Ventas.css";

export const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const categoriasList = useCategorias();
  const [NewVenta, setNewVenta] = useState({
    id_producto: "",
    cantidad_vendida: "",
    precio_unitario: 0, // Precio inicial como número
  });

  useEffect(() => {
    const fetchObtenerVentas = async () => {
      const data = await ObtenerVentas();
      setVentas(data);
    };
    fetchObtenerVentas();
  }, []);

  const manejarBusqueda = (e) => {
    setBusqueda(e.target.value.toLowerCase());
  };

  const manejarFiltroCategoria = (e) => {
    setFiltroCategoria(e.target.value);
  };

  const productosFiltrados = ventas.filter((producto) => {
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda);
    const coincideCategoria =
      filtroCategoria === "" || producto.id_categoria === parseInt(filtroCategoria);
    return coincideBusqueda && coincideCategoria;
  });

  const ObtenerDatosVentas = (e) => {
    const { name, value } = e.target;

    setNewVenta((prev) => {
      const updatedVenta = {
        ...prev,
        [name]: name === "id_producto" || name === "cantidad_vendida" ? Number(value) : value,
      };

      // Actualizar el precio si se cambia el id_producto
      if (name === "id_producto") {
        const productoSeleccionado = ventas.find(
          (producto) => producto.id_producto === Number(value)
        );
        if (productoSeleccionado) {
          updatedVenta.precio_unitario = Number(productoSeleccionado.precio_unitario); // Asignar precio como número
        }
      }

      return updatedVenta;
    });
  };

  const NuevaVenta = async () => {
    if (!validarNuevaVenta(NewVenta, ventas)) return;
    console.log(NewVenta);
    try {
      await AgregarVentas(NewVenta);
      const data = await ObtenerVentas()
      setVentas(data)
      alert("Venta agregada correctamente");
    } catch (err) {
      alert("Hubo un problema para agregar la venta");
    }
  };

  return (
    <div className="contenedor_ventas">
      <div className="acciones">
        <div className="contenedor_nuevaVenta">
          <input
            type="text"
            name="id_producto"
            placeholder="ID Producto"
            onChange={ObtenerDatosVentas}
          />
          <input
            type="number"
            name="cantidad_vendida"
            placeholder="Cantidad"
            onChange={ObtenerDatosVentas}
          />
          <button onClick={NuevaVenta}>Agregar</button>
        </div>
        <div className="contenedor_buscar">
          <input
            type="text"
            placeholder="Buscar"
            className="input_buscar"
            onChange={manejarBusqueda}
          />
          <CategoriaSelect
            categorias={categoriasList}
            value={filtroCategoria}
            onChange={manejarFiltroCategoria}
          />
        </div>
      </div>

      <div className="contenedor_detalleVentas">
        {productosFiltrados.length > 0 ? (
          <table className="tabla_ventas">
            <thead className="tabla_cabecera">
              <tr className="tabla_fila_cabecera">
                <th className="tabla_columna_cabecera">ID</th>
                <th className="tabla_columna_cabecera">Nombre</th>
                <th className="tabla_columna_cabecera">Cantidad</th>
                <th className="tabla_columna_cabecera">Precio Producto</th>
                <th className="tabla_columna_cabecera">Fecha</th>
                <th className="tabla_columna_cabecera">Total</th>
                <th className="tabla_columna_cabecera">Acciones</th>
              </tr>
            </thead>
            <tbody className="tabla_cuerpo">
              {productosFiltrados.map((venta) => (
                <tr key={venta.id_detalle_venta} className="tabla_fila">
                  <td className="tabla_celda">{venta.id_producto}</td>
                  <td className="tabla_celda">{venta.nombre}</td>
                  <td className="tabla_celda">{venta.cantidad_vendida}</td>
                  <td className="tabla_celda">${venta.precio}</td>
                  <td className="tabla_celda">{venta.fecha_venta}</td>
                  <td className="tabla_celda">
                    {venta.precio * venta.cantidad_vendida}
                  </td>
                  <td className="tabla_celda">
                    <button className="boton_editar">✏️ Editar</button>
                    <button className="boton_eliminar">🗑️ Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mensaje_cargando">Cargando Ventas...</p>
        )}
      </div>
    </div>
  );
};
