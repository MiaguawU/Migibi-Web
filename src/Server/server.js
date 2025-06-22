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
const tipo_alimento =  require("./base/cat_tipo_alimento");
const unidad_medida = require("./base/cat_unidad_medida");
const recetaSecreta = require("./base/recetaSecreta");
const recetas_diaGeneral = require("./base/receta_diaGeneral");
const recetas_diaDesayuno = require("./base/receta_diaDesayuno");
const recetas_diaComida = require("./base/receta_diaComida");
const recetas_diaCena = require("./base/receta_diaCena");
const hoyGeneral = require("./base/HoyGeneral");
const alimUnico = require("./base/AlimentoUnico");
const cat_alimento = require("./base/cat_alimento");
const usuario_adm = require("./base/usuario_admin");
const rol = require("./base/rol");
const registro = require("./base/Registro");
const recuperar = require("./base/Recuperar_Contrasena");
const rateLimit = require("express-rate-limit");
const planes = require("./base/Planes");
const usuario_Alimento = require("./base/usuario_cat_alimento");
const { OAuth2Client } = require('google-auth-library');

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
const allowedOrigins = [
  process.env.FRONTM,
  process.env.FRONTEND_URL,
  process.env.FRONTM2, // si estás usando Expo Go en un dispositivo físico
  process.env.FRONT_APK,
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite solicitudes sin origen (como curl o postman) o si el origen está en la lista
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
let tempDatabase = {};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10000, // Máximo 100 solicitudes por IP
  message: "Demasiadas solicitudes desde esta IP, intenta más tarde."
});

app.use(limiter);

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

app.use(express.json({ limit: '50mb' })); // For JSON payloads
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rutas de usuarios
app.use("/usuarios", usuarioRouter);
app.use("/usuarioGmail", usuarioGmailRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/manejo",call)
app.use("/save", routerSave);
app.use("/us_adm", usuario_adm);
app.use("/rol", rol);
app.use("/registro", registro);
app.use("/password", recuperar);
app.use("/usuario_cat_alimento", usuario_Alimento);

// Ruta de autenticación con Google
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

const getRedirectUrl = (origin) => {
  const allowedRedirects = {
    [process.env.FRONTM]: process.env.FRONTM,
    [process.env.FRONTEND_URL]: process.env.FRONTEND_URL,
    [process.env.FRONTM2]: process.env.FRONTM2,
    [process.env.FRONT_APK]: process.env.FRONT_APK
  };
  

  return allowedRedirects[origin] || "http://localhost:3000";
};


// Ruta de callback después de la autenticación con Google
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    try {
      const user = {
        id: req.user.Id_Usuario,
        username: req.user.Nombre_Usuario,
        email: req.user.Email,
        foto_perfil: req.user.foto_perfil,
        Cohabitantes: req.user.Cohabitantes || null,
      };

      const queryParams = new URLSearchParams({
        id: user.id.toString(),
        username: user.username,
        email: user.email,
        foto_perfil: user.foto_perfil,
        Cohabitantes: user.Cohabitantes ? user.Cohabitantes.toString() : "",
        message: "Sesión iniciada con éxito",
      });

      const origin = req.headers.origin || "http://localhost:3000";
      const redirectURL = getRedirectUrl(origin);
      res.redirect(`${redirectURL}/dashboard?${queryParams}`);
    } catch (error) {
      console.error("Error durante el callback de Google:", error);
      res.redirect("/error?message=Error durante la autenticación");
    }
  }
);

const client = new OAuth2Client();

app.post('/auth/mobile/google', async (req, res) => {
  console.log('Cuerpo recibido:', req.body);
  const { id_token } = req.body;

  if (!id_token) {
    return res.status(400).json({ error: 'id_token no recibido' });
  }

  try {
    const ticket = await client.verifyIdToken({
  idToken: id_token,
  audience: [
    process.env.CLIENT_ID_ANDROID,
    process.env.CLIENT_ID
  ],
});


    const payload = ticket.getPayload();
    const email = payload.email;
    const nombre = payload.name;
    const fotoPerfil = payload.picture;

    // Luego sigue la lógica que ya tienes para registrar o recuperar usuario:
    db.query("SELECT * FROM usuario WHERE Email = ?", [email], async (err, results) => {
      if (err) return res.status(500).json({ error: 'DB error' });

      if (results.length > 0) {
        const user = results[0];
        return res.json({
          id: user.Id_Usuario,
          username: user.Nombre_Usuario,
          email: user.Email,
          foto_perfil: user.foto_perfil,
          Cohabitantes: user.Cohabitantes,
          message: "Sesión iniciada con éxito",
        });
      } else {
        // Crear nuevo usuario como ya haces:
        const password = generatePassword();
        const hashedPassword = await bcrypt.hash(password, 10);

        const validation = userSchema.validate({
          nombre,
          email,
          fotoPerfil,
          esGmail: 1,
          contrasena: password,
        });

        if (validation.error) {
          return res.status(400).json({ error: 'Datos inválidos' });
        }

        const query = `
          INSERT INTO usuario (Nombre_Usuario, Email, foto_perfil, Es_Gmail, Contrasena, Id_Rol) 
          VALUES (?, ?, ?, ?, ?, 1)
        `;
        db.query(query, [nombre, email, fotoPerfil, 1, hashedPassword], (insertErr, result) => {
          if (insertErr) return res.status(500).json({ error: 'Error creando usuario' });

          return res.json({
            id: result.insertId,
            username: nombre,
            email,
            foto_perfil: fotoPerfil,
            Cohabitantes: null,
            message: "Usuario registrado correctamente",
          });
        });
      }
    });

  } catch (err) {
    console.error('Error verificando token:', err);
    res.status(401).json({ error: 'Token inválido' });
  }
});

//modificar recetas
app.use("/recetaGeneral", recetaGeneral);
app.use("/recetaCRUD" , recetaCRUD);
app.use("/agReceta", recetaSecreta);
//ingredientes
app.use("/ingED", IngredienteReal);
app.use("/ingredientes", Ingredientes);
//tipo_consumo
app.use("/tipoC", tipo_consumo);
//Procedimiento (Instrucciones)
app.use("/proceso", Procedimiento);
app.use("/proED" , ProREAL);

//modificar stock
app.use("/alimento", alimento);
app.use("/caducar", caducar);
app.use("/alimentoInactivo", routerAlimentoInactivo);
app.use("/alUn", alimUnico);
app.use("/cat_ali", cat_alimento);

//tipo_alimento
app.use("/tipoA", tipo_alimento);
//unidad
app.use("/unidad", unidad_medida);


//Recetas_Dia y plan
app.use("/planGeneral", recetas_diaGeneral);
app.use("/editarDesayuno", recetas_diaDesayuno);
app.use("/editarComida", recetas_diaComida);
app.use("/editarCena", recetas_diaCena);
//Hoy
app.use("/hoyGeneral", hoyGeneral);
app.use("/planes", planes);

app.disable('etag'); 

const filePath = path.join(__dirname, 'images', 'defaultPerfil.png');

app.get('/', (req, res) => {
  res.send('🚀 Servidor funcionando en Render con MySQL en Railway!');
});

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);