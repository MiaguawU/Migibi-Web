const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("./connection");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.SESSION_SECRET,
      callbackURL: `${process.env.BASE_URL || "http://localhost:5000"}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      const nombre = profile.displayName;
      const fotoPerfil = profile.photos[0].value;

      db.query("SELECT * FROM usuario WHERE Email = ?", [email], (err, results) => {
        if (err) return done(err);

        if (results.length > 0) {
          // Usuario existente: actualizar datos solo si han cambiado
          const usuarioExistente = results[0];
          
            return done(null, usuarioExistente); // Datos ya están actualizados
        } else {
          // Usuario nuevo: insertar datos
          const contrasenaPredeterminada = "sopaDEpollo22";
          const query =
            "INSERT INTO usuario (Nombre_Usuario, Email, foto_perfil, Es_Gmail, Contrasena) VALUES (?, ?, ?, ?, ?)";
          db.query(query, [nombre, email, fotoPerfil, 1, contrasenaPredeterminada], (insertErr, result) => {
            if (insertErr) return done(insertErr);

            const newUser = {
              Id_Usuario: result.insertId,
              Nombre_Usuario: nombre,
              Email: email,
              foto_perfil: fotoPerfil,
              Cohabitantes: null,
              Es_Gmail: 1,
            };
            return done(null, newUser); // Usuario recién creado
          });
        }
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.Id_Usuario);
});

passport.deserializeUser((id, done) => {
  db.query("SELECT * FROM usuario WHERE Id_Usuario = ?", [id], (err, results) => {
    if (err) return done(err);
    done(null, results[0]);
  });
});

module.exports = passport;
