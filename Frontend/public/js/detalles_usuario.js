document.addEventListener("DOMContentLoaded", async () => {
    const cuerpoTabla = document.getElementById("cuerpo-tabla");

    // Obtener token del localStorage
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/";
        return;
    }

    try {
        // Obtener historial del backend
        const respuesta = await fetch("http://localhost:3000/api/historial", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        console.log("Status:", respuesta.status);

        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            console.error("Error response:", errorData);
            throw new Error(errorData.mensaje || "Error al obtener historial");
        }

        const historial = await respuesta.json();
        console.log("Historial obtenido:", historial);

        // Limpiar tabla
        cuerpoTabla.innerHTML = "";

        // Verificar si hay datos
        if (!historial || historial.length === 0) {
            cuerpoTabla.innerHTML = "<tr><td colspan='6'>No hay registros de acceso aún.</td></tr>";
            return;
        }

        // Llenar tabla con datos del backend
        historial.forEach(acceso => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${acceso.documento || "N/A"}</td>
                <td>${acceso.nombre || "N/A"} ${acceso.apellido || ""}</td>
                <td>${acceso.hora || "--:--"}</td>
                <td>${acceso.dia || "--"}</td>
                <td>${acceso.mes || "--"}</td>
                <td>${acceso.anio || "----"}</td>
            `;
            cuerpoTabla.appendChild(fila);
        });

    } catch (error) {
        console.error("Error completo:", error);
        cuerpoTabla.innerHTML = `<tr><td colspan='6'>⚠️ Error: ${error.message}</td></tr>`;
    }
});
