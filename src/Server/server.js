const express = require("express");
const session = require("express-session");
const multer = require("multer");
const passport = require("./base/auth"); 
const usuarioRouter = require("./base/usuario");
const usuarioGmailRouter = require("./base/usuarioGmail");
const loginRouter = require("./base/login");
const logoutRouter = require("./base/Logout");
const recetaGeneral = require("./base/receta");
const alimento = require("./base/Alimento");
const caducar = require("./base/Caducar");
const call = require("./base/ManejodeAuth");
const routerSave = require("./base/SaveGmail");
const routerAlimentoInactivo = require ("./base/AlimentoInactivo");
const IngredienteReal = require ("./base/IngredienteREAL");
const Ingredientes = require("./base/Ingredientes");
const recetaCRUD = require("./base/RecetaCRUD");
const tipo_consumo= require("./base/cat_tipo_consumo");
const morgan = require('morgan');
const dotenv = require("dotenv");
const cors = require("cors");
const path = require('path');
const Procedimiento = require("./base/Procedimiento")
const ProREAL = require("./base/ProcedimientoREAL")

dotenv.config();

// Configuración de multer
const upload = multer({
  storage: multer.memoryStorage(),
}).any();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'imagenes'));  // Especifica correctamente la ruta
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});


// Inicializamos el servidor
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/imagenes', express.static(path.join(__dirname, 'imagenes')));

// Configuración de sesiones
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());


// Rutas de usuarios
app.use("/usuarios", upload, usuarioRouter);
app.use("/usuarioGmail", usuarioGmailRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/manejo",call)
app.use("/save", routerSave);

// Ruta de autenticación con Google
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

const BASE_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Ruta de callback después de la autenticación con Google
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    try {
      // Datos del usuario autenticado
      const user = {
        id: req.user.Id_Usuario,
        username: req.user.Nombre_Usuario,
        email: req.user.Email,
        foto_perfil: req.user.foto_perfil,
        Cohabitantes: req.user.Cohabitantes || null,
      };

      // Serializar los datos del usuario como query string
      const queryParams = new URLSearchParams({
        id: user.id.toString(),
        username: user.username,
        email: user.email,
        foto_perfil: user.foto_perfil,
        Cohabitantes: user.Cohabitantes ? user.Cohabitantes.toString() : "",
        message: "Sesión iniciada con éxito",
      });

      // Redirigir al frontend con los datos
      const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";
      res.redirect(`${frontendURL}/dashboard?${queryParams}`);
    } catch (error) {
      console.error("Error durante el callback de Google:", error);
      res.redirect(`${BASE_URL}/error?message=Error durante la autenticación`);
    }
  }
);

//modificar recetas
app.use("/recetaGeneral", recetaGeneral);
app.use("/recetaCRUD" , recetaCRUD)
//ingredientes
app.use("/ingED", IngredienteReal);
app.use("/ingredientes", Ingredientes);
//tipo_consumo
app.use("/tipoC", tipo_consumo);
//Procedimiento (Instrucciones)
app.use("/proceso", Procedimiento);
app.use("/proED" , ProREAL);

//modificar alimentos
app.use("/alimento", alimento);
app.use("/caducar", caducar);
app.use("/alimentoInactivo", routerAlimentoInactivo);

app.disable('etag'); // En Express.js

const filePath = path.join(__dirname, 'images', 'defaultPerfil.png');

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
