// ---------------------------
// CONEXIÓN A LA BASE DE DATOS
// ---------------------------

// Importa la librería mysql2
import mysql from "mysql2/promise";

// Importa dotenv
import dotenv from "dotenv";

// Carga las variables del archivo .env
dotenv.config();

// Crea la conexión con MySQL
const conexion = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Mensaje de confirmación
console.log("✅ Conectado correctamente a MySQL");

export default conexion;