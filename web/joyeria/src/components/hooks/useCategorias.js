import { useState, useEffect } from "react";
import { ObtenerCategorias } from "../Productos/services/ServicesProducts";

export const useCategorias = () => {
  const [categoriasList, setCategoriasList] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      const data = await ObtenerCategorias();
      setCategoriasList(data);
    };

    fetchCategorias();
  }, []);

  return categoriasList;
};
