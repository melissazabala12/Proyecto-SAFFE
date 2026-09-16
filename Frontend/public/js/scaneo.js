// Obtenemos los elementos HTML con los que vamos a interactuar
const video = document.getElementById("camara");
const boton = document.getElementById("botonscan");
const canvas = document.getElementById("foto");
const ctx = canvas.getContext("2d");

// CONFIGURACIÓN DE TU COMPREFACE LOCAL
const COMPREFACE_URL = "http://localhost:8000/api/v1/recognition/recognize";
const API_KEY = "397f4718-539c-47d2-a777-9ea595352b70"; // <-- Pega aquí la clave que te dio el panel web

/**
 * Función para encender la cámara web o frontal del celular.
 */
async function iniciarCamara() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" }
        });
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();
        };
    } catch (error) {
        alert("No se pudo acceder a la cámara: " + error);
    }
}

// Ejecutamos la función apenas carga el script
iniciarCamara();

/**
 * Función auxiliar para convertir la imagen del canvas (Base64) a un archivo binario (Blob)
 * que la API de CompreFace pueda entender.
 */
function canvasToBlob(canvasElement) {
    return new Promise((resolve) => {
        canvasElement.toBlob((blob) => {
            resolve(blob);
        }, "image/jpeg", 0.95); // Comprimimos a JPG de buena calidad
    });
}

/**
 * Evento al hacer clic en el botón "CAPTURAR ROSTRO"
 */
boton.addEventListener("click", async () => {
    // Ajustamos el lienzo (canvas) al tamaño exacto de la cámara
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dibujamos el fotograma actual en el lienzo oculto
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convertimos el dibujo a formato base64 para mostrarlo visualmente en el HTML
    const fotoBase64 = canvas.toDataURL("image/jpeg");

    // Buscamos si ya habíamos tomado una foto antes y la borramos
    const anterior = document.getElementById("fotoTomada");
    if (anterior) anterior.remove();

    // Creamos la etiqueta <img> para mostrar el rostro capturado en pantalla
    const img = new Image();
    img.id = "fotoTomada";
    img.src = fotoBase64;
    img.style.width = "90%";
    img.style.maxWidth = "400px";
    img.style.borderRadius = "10px";
    img.style.border = "3px solid #0b4d1e";
    img.style.marginTop = "20px";
    
    document.getElementById("scanner").appendChild(img);

    // --- CONSUMO DE LA API REAL DE COMPREFACE ---
    const campoMensaje = document.getElementById("mensaje");
    campoMensaje.innerHTML = "Procesando escaneo facial en servidores locales...";

    try {
        // 1. Convertimos el canvas a un archivo binario real
        const blob = await canvasToBlob(canvas);

        // 2. Preparamos el contenedor "FormData" que exige la API para subir archivos
        const formData = new FormData();
        formData.append("file", blob, "captura.jpg");

        // 3. Enviamos la foto a tu servidor local con fetch
        const respuesta = await fetch(COMPREFACE_URL, {
            method: "POST",
            headers: {
                "x-api-key": API_KEY // Autenticación local
            },
            body: formData
        });

        const datos = await respuesta.json();
        console.log("Respuesta del servidor:", datos);

        // 4. Analizamos la respuesta de Inteligencia Artificial
        if (datos.result && datos.result.length > 0 && datos.result[0].subjects.length > 0) {
            const coincidencia = datos.result[0].subjects[0];
            const nombreSoldado = coincidencia.subject;
            const similitud = (coincidencia.similarity * 100).toFixed(2); // Convertimos a porcentaje

            // Umbral de seguridad militar (80% o más)
            if (similitud >= 80) {
                campoMensaje.innerHTML = `
                    <div style="color: #0b4d1e; font-weight: bold; margin-top: 15px; border: 2px solid #0b4d1e; padding: 10px; background-color: #e8f5e9;">
                        🟢 ACCESO CONCEDIDO <br>
                        <span style="font-weight: normal; color: #333;">
                            Identidad: ${nombreSoldado} <br>
                            Coincidencia Biométrica: ${similitud}%
                        </span>
                    </div>
                `;

                // Registrar acceso en la base de datos
                const token = localStorage.getItem("token");
                const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificar JWT
                const documento = decodedToken.documento;

                try {
                    await fetch("http://localhost:3000/api/accesos", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            documento: documento,
                            estado: "autorizado"
                        })
                    });
                } catch (error) {
                    console.error("Error al registrar acceso:", error);
                }

                // ==========================================
                //  REDIRECCIÓN A ACCESO AUTORIZADO
                // ==========================================
                setTimeout(() => {
                    window.location.href = "/acceso_autorizado"; 
                }, 2000); // Espera 2 segundos antes de redirigir

            } else {
                campoMensaje.innerHTML = `
                    <div style="color: #b71c1c; font-weight: bold; margin-top: 15px; border: 2px solid #b71c1c; padding: 10px; background-color: #ffebee;">
                        🔴 ACCESO DENEGADO <br>
                        <span style="font-weight: normal; color: #333;">
                            Nivel de confianza insuficiente (${similitud}%).
                        </span>
                    </div>
                `;

                // Registrar acceso denegado
                const token = localStorage.getItem("token");
                const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificar JWT
                const documento = decodedToken.documento;

                try {
                    await fetch("http://localhost:3000/api/accesos", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            documento: documento,
                            estado: "denegado"
                        })
                    });
                } catch (error) {
                    console.error("Error al registrar acceso denegado:", error);
                }

                // Redirigir a acceso denegado después de 2 segundos
                setTimeout(() => {
                    window.location.href = "/acceso_denegado";
                }, 2000);
            }
        } else {
            // El servidor procesó la foto pero no encontró a nadie que se le parezca
            campoMensaje.innerHTML = `
                <div style="color: #b71c1c; font-weight: bold; margin-top: 15px; border: 2px solid #b71c1c; padding: 10px; background-color: #ffebee;">
                    🔴 ACCESO DENEGADO <br>
                    <span style="font-weight: normal; color: #333;">
                        Rostro no registrado en la base de datos militar.
                    </span>
                </div>
            `;

            // Registrar acceso denegado (rostro no registrado)
            const token = localStorage.getItem("token");
            if (token) {
                const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificar JWT
                const documento = decodedToken.documento;

                try {
                    await fetch("http://localhost:3000/api/accesos", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            documento: documento,
                            estado: "rostro_no_registrado"
                        })
                    });
                } catch (error) {
                    console.error("Error al registrar acceso denegado:", error);
                }
            }

            // Redirigir a acceso denegado después de 2 segundos
            setTimeout(() => {
                window.location.href = "/acceso_denegado";
            }, 2000);
        }

    } catch (error) {
        // Error si el Docker está apagado o la IP es incorrecta
        campoMensaje.innerHTML = `
            <div style="color: red; font-weight: bold; margin-top: 15px;">
                ❌ ERROR DE SISTEMA: <br>
                <span style="font-weight: normal;">No se pudo conectar con el motor biométrico local. Asegúrate de que Docker esté corriendo.</span>
            </div>
        `;
        console.error("Error al consumir CompreFace:", error);
    }
});