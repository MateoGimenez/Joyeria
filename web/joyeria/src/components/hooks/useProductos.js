import { useState , useEffect } from "react";
import { ObtenerProductos } from "../Productos/services/ServicesProducts";

export const useProductos = () => {
    const [Productos , setProductos] = useState([])
    
    useEffect(() =>{ 
        const fetchProductos = async () => {
            const data = await ObtenerProductos()
            setProductos(data)
        };

        fetchProductos()
    },[])

    return Productos
}