import { Router } from "express";

import {

    obtenerHistorial

} from "../controllers/controller.historial.js";

import {

    verificarToken

} from "../middleware/auth.middleware.js";

const router = Router();

router.get(

    "/historial",

    verificarToken,

    obtenerHistorial

);

export default router;
