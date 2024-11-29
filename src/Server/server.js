const express = require("express");
const session = require("express-session");
const multer = require("multer");
const passport = require("./base/auth"); // Autenticación con Google
const usuarioRouter = require("./base/usuario");
const usuarioGmailRouter = require("./base/usuarioGmail");
const loginRouter = require("./base/login");
const logoutRouter = require("./base/Logout");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

// Configuración de multer
const upload = multer({
  storage: multer.memoryStorage(),
}).any();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "imagenes/");
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

// Rutas existentes
app.use("/usuarios", upload, usuarioRouter);
app.use("/usuarioGmail", usuarioGmailRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);

// Ruta de inicio de sesión con Google
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback después de la autenticación con Google
const BASE_URL = process.env.FRONTEND_URL || "http://localhost:3000";

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${BASE_URL}/acceder`,
    session: true,
  }),
  (req, res) => {
    if (req.user) {
      // Envía la información del usuario junto con una indicación de redirección
      res.json({
        id: req.user.Id_Usuario,
        username: req.user.Nombre_Usuario,
        foto_perfil: req.user.foto_perfil,
        Email: req.user.Email,
        message: "Sesión iniciada con éxito mediante Google",
        redirectTo: `${BASE_URL}/perfil`,
      });
    } else {
      res.status(401).json({ message: "Autenticación fallida" });
    }
  }
);





// Inicio del servidor
const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);

