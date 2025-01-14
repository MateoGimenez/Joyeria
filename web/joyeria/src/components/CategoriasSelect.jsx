import React from "react";

export const CategoriaSelect = ({ categorias, value, onChange }) => {
  return (
    <select name="id_categoria" value={value} onChange={onChange}>
      <option value="">Todos</option>
      {categorias.length > 0 ? (
        categorias.map((cat) => (
          <option key={cat.id_categoria} value={cat.id_categoria}>
            {cat.nombre_categoria}
          </option>
        ))
      ) : (
        <option disabled>Cargando categorías...</option>
      )}
    </select>
  );
};
