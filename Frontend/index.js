// --------------
// IMPORTACIONES
// --------------

// Framework Express
import express from "express";

// Manejo de sesiones
import session from "express-session";

// Rutas del proyecto
import rutas from "./app/routes/routes.views.js";

// ----------------------
// CONFIGURACIÓN INICIAL
// ----------------------

const app = express();

// Puerto del Frontend
const PORT = 4000;

// -------------------
// CONFIGURACIÓN EJS
// -------------------

app.set("view engine", "ejs");
app.set("views", "./views");

// -----------
// MIDDLEWARE
// -----------

// Leer formularios
app.use(express.urlencoded({ extended: true }));

// Leer JSON
app.use(express.json());

// Archivos públicos
app.use(express.static("public"));

// Sesiones
app.use(session({

    secret: "saffe_frontend",

    resave: false,

    saveUninitialized: false,

    cookie: {

        maxAge: 2 * 60 * 60 * 1000

    }

}));

// ------
// RUTAS
// ------

app.use("/", rutas);

// -----------------
// INICIAR SERVIDOR
// -----------------

app.listen(PORT, () => {

    console.log(`Frontend ejecutándose en http://localhost:${PORT}`);

});