import { Router } from "express";

import {

    getLogin,
    getRegistrarse,
    getEscaneo,
    getAccesoAutorizado,
    getAccesoDenegado,
    getDetalleUsuario

} from "../controllers/controller.views.js";

const router = Router();

// ------
// RUTAS
// ------

router.get("/", getLogin);

router.get("/registrarse", getRegistrarse);

router.get("/escaneo", getEscaneo);

router.get("/acceso_autorizado", getAccesoAutorizado);

router.get("/acceso_denegado", getAccesoDenegado);

router.get("/detalle_usuario", getDetalleUsuario);

export default router;