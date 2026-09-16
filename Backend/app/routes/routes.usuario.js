// -------------------------
// IMPORTACIÓN DE LIBRERÍAS
// -------------------------

// Importa Router de Express
import { Router } from "express";

// Importación de controladores
import {
    obtenerPerfil
} from "../controllers/controller.usuario.js";

// Middleware de autenticación
import { verificarToken } from "../middleware/auth.middleware.js";

// -------------------------
// CREAR ROUTER
// -------------------------

const router = Router();

// -------------------------
// RUTAS USUARIOS
// -------------------------

// Obtener perfil del usuario autenticado
router.get("/perfil", verificarToken, obtenerPerfil);

// Exportar router
export default router;