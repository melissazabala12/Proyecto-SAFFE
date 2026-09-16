// --------------
// IMPORTACIONES
// --------------

// Importa la librería JWT
import jwt from "jsonwebtoken";

// Clave secreta utilizada para validar el token
const SECRET = "mi_clave_super_secreta";

// ---------------
// VERIFICAR TOKEN
// ---------------

// Middleware que verifica si el usuario envió un token válido
export const verificarToken = (req, res, next) => {

    // Obtiene el token del encabezado Authorization
    const token = req.headers.authorization;

    // Verifica si existe el token
    if (!token) {

        return res.status(401).json({

            mensaje: "Acceso denegado. Token no proporcionado."

        });

    }

    try {

        // Elimina la palabra Bearer
        const tokenLimpio = token.replace("Bearer ", "");

        // Verifica y decodifica el token
        const decodificado = jwt.verify(tokenLimpio, SECRET);

        // Guarda los datos del token en la request
        req.usuario = decodificado;

        // Continúa con la siguiente función
        next();

    } catch (error) {

        res.status(401).json({

            mensaje: "Token inválido"

        });

    }

};