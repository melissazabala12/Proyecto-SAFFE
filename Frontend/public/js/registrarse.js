document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-registro");
    
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Creamos FormData para incluir el archivo de imagen
        const formData = new FormData();
        formData.append("id_militar", document.getElementById("cedula").value);
        formData.append("nombres", document.getElementById("nombre").value);
        formData.append("apellidos", document.getElementById("apellidos").value);
        formData.append("correo", document.getElementById("correo").value);
        formData.append("password", document.getElementById("password").value);
        formData.append("rango", document.getElementById("rango").value);
        formData.append("foto", document.getElementById("foto").files[0]); // El archivo
        formData.append("fecha_ingreso", new Date().toISOString().split('T')[0]);
        formData.append("estado", 'Activo');

        try {
            const respuesta = await fetch("http://localhost:3000/api/usuarios-facial", {
                method: "POST",
                body: formData // Ya no enviamos JSON, enviamos el FormData
            });

            if (!respuesta.ok) {
                const errorData = await respuesta.json();
                throw new Error(errorData.error || errorData.mensaje || "Error al registrar");
            }

            alert("¡Registro exitoso con validación facial!");
            form.reset();
        } catch (error) {
            console.error("Detalle:", error);
            alert("Error: " + error.message);
        }
    });
});