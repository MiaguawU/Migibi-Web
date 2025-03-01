const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
const db = require("./connection");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.SESSION_SECRET,
      callbackURL: `${process.env.BASE_URL || "http://localhost:5000"}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      const nombre = profile.displayName;
      const fotoPerfil = profile.photos[0].value;

      db.query("SELECT * FROM usuario WHERE Email = ?", [email], async (err, results) => {
        if (err) return done(err);

        if (results.length > 0) {
          // Usuario existente: devolver los datos
          return done(null, results[0]);
        } else {
          // Usuario nuevo: cifrar la contraseña predeterminada antes de insertarla
          const contrasenaPredeterminada = "sopaDEpollo22";
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(contrasenaPredeterminada, saltRounds);

          const query = `
            INSERT INTO usuario (Nombre_Usuario, Email, foto_perfil, Es_Gmail, Contrasena, Id_Rol) 
            VALUES (?, ?, ?, ?, ?, 1)
          `;
          db.query(query, [nombre, email, fotoPerfil, 1, hashedPassword], (insertErr, result) => {
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
