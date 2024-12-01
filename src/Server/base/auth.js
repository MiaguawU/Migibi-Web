const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require('./connection');

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
          // Si el usuario ya existe, actualizamos sus datos
          const query =
            "UPDATE usuario SET Nombre_Usuario = ?, foto_perfil = ? WHERE Email = ?";
          db.query(query, [nombre, fotoPerfil, email], (err, result) => {
            if (err) return done(err);

            const updatedUser = {
              Id_Usuario: results[0].Id_Usuario,
              Nombre_Usuario: nombre,
              Email: email,
              foto_perfil: fotoPerfil,
              Es_Gmail: 1,
            };

            return done(null, updatedUser); // Usuario actualizado
          });
        } else {
          // Si el usuario no existe, lo insertamos
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

            return done(null, newUser); // Usuario recién creado
          });
        }
        // Después de recibir los datos del usuario (en el callback de Google OAuth o la respuesta del servidor):
        fetch('/auth/google/callback', {
          method: 'GET',
          credentials: 'same-origin',
        })
          .then(response => response.json())
          .then(user => {
            // Guardamos los datos del usuario en localStorage
            localStorage.setItem('user', JSON.stringify(user)); // 'user' almacena los datos de usuario

            // Redirigir al perfil
            window.location.href = '/perfil'; // Ruta al perfil
          })
          .catch((err) => {
            console.error('Error al iniciar sesión', err);
            message.error("No se pudo iniciar sesión");
          });

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
