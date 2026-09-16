import { Router } from "express";

import { validarEscaneo } from "../controllers/controller.escaneo.js";

import { verificarToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/escaneo", verificarToken, validarEscaneo);

export default router;
