document.addEventListener("DOMContentLoaded", async () => {
    const nombreEl = document.getElementById("nombre-usuario");
    const rangoEl = document.getElementById("rango-usuario");
    const horaEl = document.getElementById("hora-ingreso");

    // Calculamos la hora actual
    const ahora = new Date();
    horaEl.textContent = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Verificación: ¿Hay token guardado?
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/";
        return;
    }

    // 2. Pedimos los datos reales al Backend
    try {
        const respuesta = await fetch("http://localhost:3000/api/perfil", {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${token}` 
            }
        });

        if (respuesta.ok) {
            const datos = await respuesta.json();
            console.log("Datos del usuario:", datos);
            
            // Validamos que los datos existan antes de mostrarlos
            if (datos.nombre || datos.nombres) {
                nombreEl.textContent = `${datos.nombre || datos.nombres} ${datos.apellido || datos.apellidos || ''}`; 
            }
            if (datos.rango) {
                rangoEl.textContent = datos.rango;
            }
        } else {
            const errorData = await respuesta.json();
            console.error("Error del servidor:", errorData);
            alert("Error de sesión: " + errorData.mensaje);
            localStorage.removeItem("token");
            window.location.href = "/";
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        alert("Error de conexión con el servidor.");
        window.location.href = "/";
    }
});