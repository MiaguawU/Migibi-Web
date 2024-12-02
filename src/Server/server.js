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

const dotenv = require("dotenv");
const cors = require("cors");
const path = require('path');
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

// Ruta de autenticación con Google
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

const BASE_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Ruta de callback después de la autenticación con Google
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${BASE_URL}/acceder`,
    session: false,
  }),
  (req, res) => {
    if (req.user) {
      const user = {
        id: req.user.Id_Usuario,
        username: req.user.Nombre_Usuario,
        foto_perfil: req.user.foto_perfil,
        Cohabitantes: req.user.Cohabitantes,
        Email: req.user.Email,
      };

      // Redirigir al frontend y almacenar los datos del usuario en localStorage
      res.json(user); // Responder con los datos del usuario en formato JSON
    } else {
      res.status(401).json({ message: "Autenticación fallida" });
    }
  }
);




//modificar recetas
app.use("/recetaGeneral", recetaGeneral);

//modificar alimentos
app.use("/alimento", alimento);
app.use("/caducar", caducar);
const filePath = path.join(__dirname, 'images', 'defaultPerfil.png');

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
