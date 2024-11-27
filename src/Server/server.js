const express = require("express");
const session = require("express-session");
const multer = require("multer");
const passport = require("./base/auth"); // Autenticación con Google
const usuarioRouter = require("./base/usuario");
const usuarioGmailRouter = require("./base/usuarioGmail");
const loginRouter = require("./base/login");
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

// Ruta de inicio de sesión con Google
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback después de la autenticación con Google
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login-failed",
    session: true,
  }),
  (req, res) => {
    // Redirigir después de iniciar sesión exitosamente
    res.redirect("/login-success");
  }
);

// Ruta de cierre de sesión
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Error al cerrar sesión");
    }
    res.redirect("/");
  });
});

// Rutas para manejar el éxito o el fallo de login
app.get("/login-success", (req, res) => {
  res.send("Inicio de sesión exitoso");
});

app.get("/login-failed", (req, res) => {
  res.status(401).send("Inicio de sesión fallido");
});

// Inicio del servidor
const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
