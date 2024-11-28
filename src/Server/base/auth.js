const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require('./connection')

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID, 
      clientSecret: process.env.SESSION_SECRET, 
      callbackURL: "http://localhost:5000/auth/google/callback",

    },
    (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      const nombre = profile.displayName;
      const fotoPerfil = profile.photos[0].value;

      db.query("SELECT * FROM usuario WHERE Email = ?", [email], (err, results) => {
        if (err) return done(err);
        
        if (results.length > 0) {
          return done(null, results[0]);
        } else {
          const query =
            "INSERT INTO usuario (Nombre_Usuario, Email, foto_perfil, Es_Gmail) VALUES (?, ?, ?, ?)";
          db.query(query, [nombre, email, fotoPerfil, 1], (err, result) => {
            if (err) return done(err);
            const newUser = {
              Id_Usuario: result.insertId,
              Nombre_Usuario: nombre,
              Email: email,
              foto_perfil: fotoPerfil,
              Es_Gmail: 1,
            };
            return done(null, newUser);
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
