
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
            body: JSON.stringify(NewVenta), // Asegúrate de convertir el objeto a JSON
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
