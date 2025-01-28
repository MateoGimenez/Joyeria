import React from "react";

export const CategoriaSelect = ({ categorias, value, onChange }) => {
  const selectStyles = {
    width: "50%",
    maxWidth: "300px",
    padding: "8px 12px",
    fontSize: "16px",
    border: "1px solid goldenrod",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
    color: "#333",
    appearance: "none",
    WebkitAppearance: "none",
  };

  const optionStyles = {
    backgroundColor: "#fff",
    color: "#333",
    fontSize: "16px",
  };

  return (
    <select
      name="id_categoria"
      value={value}
      onChange={onChange}
      style={selectStyles}
    >
      <option value="">Todos</option>
      {categorias.length > 0 ? (
        categorias.map((cat) => (
          <option
            key={cat.id_categoria}
            value={cat.id_categoria}
            style={optionStyles}
          >
            {cat.nombre_categoria}
          </option>
        ))
      ) : (
        <option disabled style={optionStyles}>
          Cargando categorías...
        </option>
      )}
    </select>
  );
};
