document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const documento = document.getElementById("documento").value;

        const contraseña = document.getElementById("password").value;

        try {

            const respuesta = await fetch("http://localhost:3000/api/login", {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    documento,
                    contraseña

                })

            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {

                localStorage.setItem("token", resultado.token);

                window.location.href = "/acceso_autorizado";

            } else {

                alert(resultado.mensaje);

                window.location.href = "/acceso_denegado";

            }

        } catch (error) {

            console.error(error);

            alert("No se pudo conectar con el Backend.");

        }

    });

});