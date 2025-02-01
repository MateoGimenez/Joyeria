import { useState, useEffect } from "react";
import { CategoriaSelect } from "../CategoriasSelect";
import { useCategorias } from "../hooks/useCategorias";
import { ObtenerVentas, AgregarVentas ,BorrarVenta , ActualizarVentas} from "./Services/ServicesVentas";
import { ObtenerProductos } from "./Services/ServicesVentas";
import { validarNuevaVenta } from "./validacionesVentas";
import "./Ventas.css";

export const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [productos , setProductos] = useState([])
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const categoriasList = useCategorias();
  const [NewVenta, setNewVenta] = useState({
    id_producto: "",
    cantidad_vendida: "",
    precio_unitario: 0, 
  });
  const [VentaEditada , setVentaEditada] = useState(null)

  useEffect(() => {
    const fetchObtenerVentas = async () => {
      const data = await ObtenerVentas();
      setVentas(data);

      const info = await ObtenerProductos()
      setProductos(info)
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
        const productoSeleccionado = productos.find(
          (producto) => producto.id_producto === Number(value)
        );
        if (productoSeleccionado) {
          updatedVenta.precio_unitario = Number(productoSeleccionado.precio); // Usar productos en lugar de ventas
        } else {
          updatedVenta.precio_unitario = 0; // Si el producto no existe, dejar el precio en 0
        }
      }
      return updatedVenta;
    });

  };
  

  const NuevaVenta = async () => {
    if (!validarNuevaVenta(NewVenta, productos)) return;
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

  const BorrarVentas = async (id) => {
    try{
      await BorrarVenta(id)
      const data = await ObtenerVentas()
      setVentas(data)
    }catch(err){
      alert('Error al borrar la venta')
    }
  }

  const EditarVentas =  (id) =>{
    const VentaAEditar = ventas.find((venta) => venta.id_detalle_venta === id)
    if(VentaAEditar){
      setVentaEditada(VentaAEditar)
      setNewVenta({
        id_producto : VentaAEditar.id_producto ,
        cantidad_vendida : VentaAEditar.cantidad_vendida ,
        precio_unitario : Number(VentaAEditar.precio_unitario)
      })
    }
  }

  const ActualizarVentaEditada = async() =>{
    if(window.confirm('Confirma la actualizacion de la venta')){
      const idVenta = VentaEditada.id_detalle_venta
      console.log('Datos' , NewVenta)

      await ActualizarVentas( idVenta , NewVenta)
      const data = await ObtenerVentas()
      setVentas(data)
    }else{
      console.log('cancelo actualizar')
    }
  }
  return (
    <div className="contenedor_ventas">
      <div className="acciones">
        <div className="contenedor_nuevaVenta">
          <input
            type="number"
            name="id_producto"
            value={NewVenta.id_producto}
            placeholder="ID Producto"
            onChange={ObtenerDatosVentas}
          />
          <input
            type="number"
            name="cantidad_vendida"
            value={NewVenta.cantidad_vendida}
            placeholder="Cantidad"
            onChange={ObtenerDatosVentas}
          />
          <button  disabled={!NewVenta.id_producto || !NewVenta.cantidad_vendida} onClick={VentaEditada ? ActualizarVentaEditada : NuevaVenta}>{VentaEditada ? 'Actualizar' : 'Agregar'}</button>
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
                <th className="tabla_columna_cabecera">ID-Venta</th>
                <th className="tabla_columna_cabecera">ID-Producto</th>
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
                  <td className="tabla_celda">{venta.id_detalle_venta}</td>
                  <td className="tabla_celda">{venta.id_producto}</td>
                  <td className="tabla_celda">{venta.nombre}</td>
                  <td className="tabla_celda">{venta.cantidad_vendida}</td>
                  <td className="tabla_celda">${venta.precio_unitario}</td>
                  <td className="tabla_celda">{venta.fecha_venta}</td>
                  <td className="tabla_celda">{venta.precio * venta.cantidad_vendida}</td>
                  <td className="tabla_celda">
                    <button className="boton_editar" onClick={() => EditarVentas(venta.id_detalle_venta)}>✏️ Editar</button>
                    <button className="boton_eliminar" onClick={()=> BorrarVentas(venta.id_detalle_venta)}>🗑️ Eliminar</button>
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
