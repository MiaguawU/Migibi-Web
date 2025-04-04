const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
const db = require("./connection");
const Joi = require("joi");

const userSchema = Joi.object({
  nombre: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  fotoPerfil: Joi.string().uri().required(),
  esGmail: Joi.number().valid(0, 1).required(),
  contrasena: Joi.string().min(8).max(20).required()
});

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
          return done(null, results[0]);
        } else {
          function generatePassword() {
            const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const lowercase = "abcdefghijklmnopqrstuvwxyz";
            const numbers = "0123456789";
            function getRandomChar(set) {
              return set.charAt(Math.floor(Math.random() * set.length));
            }
            let password = [
              getRandomChar(uppercase), getRandomChar(uppercase),
              getRandomChar(lowercase), getRandomChar(lowercase),
              getRandomChar(numbers), getRandomChar(numbers),
              getRandomChar(uppercase + lowercase + numbers)
            ];
            return password.sort(() => Math.random() - 0.5).join('');
          }

          const contrasenaPredeterminada = generatePassword();
          const hashedPassword = await bcrypt.hash(contrasenaPredeterminada, 10);

          const validation = userSchema.validate({
            nombre,
            email,
            fotoPerfil,
            esGmail: 1,
            contrasena: contrasenaPredeterminada
          });

          if (validation.error) {
            return done(validation.error);
          }

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