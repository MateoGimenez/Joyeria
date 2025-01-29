
export const ObtenerVentas = async () => {
    try{
        const res = await fetch('http://localhost:3000/ventas')
        const data = await res.json()
        return data
    }catch(error){
        console.log('Error al obtener las ventas',error)
    }
}

export const AgregarVentas = async (NewVenta) => {
    try {
        const res = await fetch("http://localhost:3000/ventas", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(NewVenta), 
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Error en agregarVenta');
        }

        return res.json();
    } catch (error) {
        console.error('Error al agregar la venta:', error);
        throw error;
    }
};

export const BorrarVenta = async(id) =>{
    try{
        const res = await fetch(`http://localhost:3000/ventas/${id}`,{
            method: 'DELETE'
        });
        
        if(res.ok){
            console.log('Venta borrada')
        }
    }catch(err){
        console.log('Error al borrar la venta')
    }
}

export const ActualizarVentas = async (id, NewVenta) => {
    try {
      const res = await fetch(`http://localhost:3000/ventas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(NewVenta),
      });
  
      const data = await res.json(); // Intentar leer la respuesta JSON
  
      if (!res.ok) {
        console.error("Error al actualizar la venta:", data);
        return { success: false, error: data };
      }
  
      console.log("Venta actualizada correctamente:", data);
      return { success: true, data };
    } catch (err) {
      console.error("Error en la solicitud de actualización:", err);
      return { success: false, error: err };
    }
  };
  