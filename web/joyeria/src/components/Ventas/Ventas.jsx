import { useState , useEffect} from "react"
import { CategoriaSelect } from "../CategoriasSelect";
import { useCategorias } from "../hooks/useCategorias";

export const Ventas = () =>{
    const [busqueda, setBusqueda] = useState("");
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const categoriasList = useCategorias()
    const manejarBusqueda = (e) => {
        setBusqueda(e.target.value.toLowerCase());
      };
    
      const manejarFiltroCategoria = (e) => {
        setFiltroCategoria(e.target.value);
      };
    
        // const productosFiltrados = productos.filter((producto) => {
        // const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda);
        // const coincideCategoria =
        //   filtroCategoria === "" || producto.id_categoria === parseInt(filtroCategoria);
        // return coincideBusqueda && coincideCategoria;
        // });
    return(
        <div className="contenedor_ventas">
            <div className="acciones">
                <div className="contenedor_buscar">
                    <input type="text" placeholder="Buscar" />
                     <CategoriaSelect categorias={categoriasList}value={filtroCategoria}onChange={manejarFiltroCategoria}/>
                </div>
            </div>
        </div>
    )
}