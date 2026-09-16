import { Router } from "express";

import {

    registrarAcceso,
    listarAccesos,
    obtenerAcceso

} from "../controllers/controller.acceso.js";

import { verificarToken } from "../middleware/auth.middleware.js";

const router = Router();

// Registrar acceso
router.post("/accesos", verificarToken, registrarAcceso);

// Listar accesos
router.get("/accesos", verificarToken, listarAccesos);

// Buscar acceso
router.get("/accesos/:id", verificarToken, obtenerAcceso);

export default router;