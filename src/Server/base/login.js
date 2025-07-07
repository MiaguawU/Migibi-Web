const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./connection");
const Redis = require("ioredis");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();

const redisConfig = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  tls: process.env.REDIS_TLS === "true" ? {} : undefined,
};

const redis = new Redis(redisConfig);

redis.on("connect", () => {
  console.log("Conectado a Redis con éxito!");
});

redis.on("error", (err) => {
  console.error("Error al conectar a Redis:", err);
});

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const MAX_ATTEMPTS = 5;
const INITIAL_BLOCK_TIME_MINUTES = 15; // 15 minutos iniciales
const ADDITIONAL_BLOCK_TIME_MINUTES = 5; // 5 minutos adicionales por cada bloqueo subsiguiente
const MAX_BLOCK_TIME_HOURS = 2; // Límite máximo de 2 horas en minutos
const MAX_BLOCK_TIME_SECONDS = MAX_BLOCK_TIME_HOURS * 60 * 60; // 2 horas en segundos

/**
 * Calcula el tiempo de bloqueo actual en segundos.
 * @param {number} blockCount - El número de veces que la cuenta ha sido bloqueada.
 * @returns {number} El tiempo de bloqueo en segundos.
 */
function calculateBlockTime(blockCount) {
  let blockTimeMinutes =
    INITIAL_BLOCK_TIME_MINUTES +
    (blockCount - 1) * ADDITIONAL_BLOCK_TIME_MINUTES; // Restamos 1 porque el primer bloqueo usa solo INITIAL_BLOCK_TIME_MINUTES
  if (blockTimeMinutes < INITIAL_BLOCK_TIME_MINUTES) {
    blockTimeMinutes = INITIAL_BLOCK_TIME_MINUTES; // Asegura que el tiempo mínimo sea el inicial
  }
  const blockTimeSeconds = blockTimeMinutes * 60;
  return Math.min(blockTimeSeconds, MAX_BLOCK_TIME_SECONDS);
}

/**
 * Envía un correo electrónico de notificación de bloqueo.
 * @param {string} userEmail - El correo electrónico del usuario.
 * @param {string} userName - El nombre de usuario.
 * @param {string} blockDurationText - El tiempo de duración del bloqueo en formato legible (ej. "15 minutos", "1 hora").
 */
async function sendBlockNotificationEmail(
  userEmail,
  userName,
  blockDurationText
) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Tu cuenta de Migibi Eats ha sido bloqueada temporalmente",
      html: `
        <p>Hola ${userName},</p>
        <p>Hemos detectado varios intentos fallidos de inicio de sesión en tu cuenta de <strong>Migibi Eats</strong>.</p>
        <p>Por motivos de seguridad, tu cuenta ha sido bloqueada temporalmente por <strong>${blockDurationText}</strong>.</p>
        <p>Por favor, intenta iniciar sesión de nuevo después de este tiempo.</p>
        <p>Si crees que esto es un error o si no fuiste tú quien intentó iniciar sesión, por favor <strong>contacta con soporte inmediatamente</strong>.</p>
        <p>Gracias por usar nuestra app.</p>
        <hr/>
        <small>Este correo se envió automáticamente para tu seguridad.</small>
      `,
    });
    console.log(
      `Correo de bloqueo enviado a ${userEmail} por ${blockDurationText}.`
    );
  } catch (error) {
    console.error(`Error al enviar correo de bloqueo a ${userEmail}:`, error);
  }
}

async function isBlocked(identifier) {
  const blocked = await redis.get(`blocked:${identifier}`);
  return blocked !== null;
}

async function registerFailedAttempt(identifier, userEmail, userName) {
  const attempts = await redis.incr(`attempts:${identifier}`);

  // Configurar la expiración para el contador de intentos si es la primera vez
  // O si el tiempo de bloqueo cambió significativamente, puedes reestablecerlo
  // Por simplicidad, lo estableceremos con el BLOCK_TIME base. Podrías ajustarlo.
  if (attempts === 1) {
    // Si es el primer intento, se establece una expiración para el contador de intentos.
    // Esto es para que los intentos caduquen si no se alcanzan los MAX_ATTEMPTS en el tiempo base.
    await redis.expire(`attempts:${identifier}`, INITIAL_BLOCK_TIME_MINUTES * 60);
  }

  if (attempts >= MAX_ATTEMPTS) {
    // Incrementa el contador de veces que la cuenta ha sido bloqueada
    const blockCount = await redis.incr(`blocked_count:${identifier}`);

    // Calcula el tiempo de bloqueo actual
    const currentBlockTimeSeconds = calculateBlockTime(blockCount);

    // Formatea el tiempo de bloqueo para el correo electrónico
    let blockDurationText;
    if (currentBlockTimeSeconds < 3600) {
      // Menos de una hora, mostrar en minutos
      blockDurationText = `${Math.round(currentBlockTimeSeconds / 60)} minutos`;
    } else {
      // Una hora o más, mostrar en horas
      blockDurationText = `${(currentBlockTimeSeconds / 3600).toFixed(1)} horas`;
    }

    // Bloquea la cuenta en Redis con el tiempo calculado
    await redis.set(
      `blocked:${identifier}`,
      "true",
      "EX",
      currentBlockTimeSeconds
    );

    // Restablece el contador de intentos fallidos para el próximo ciclo
    await redis.del(`attempts:${identifier}`);

    // Configura una expiración para el `blocked_count` si quieres que el contador de bloqueos se reinicie
    // después de un período muy largo, por ejemplo, 24 horas sin bloqueos.
    // Esto evita que el tiempo de bloqueo aumente indefinidamente si el usuario deja de intentarlo por mucho tiempo.
    // Podrías poner un valor como 24 * 60 * 60 (24 horas) o más.
    await redis.expire(`blocked_count:${identifier}`, 24 * 60 * 60); // Ejemplo: Reinicia el contador de bloqueos después de 24 horas

    // Envía el correo electrónico de notificación de bloqueo
    if (userEmail && userName) {
      await sendBlockNotificationEmail(userEmail, userName, blockDurationText);
    }
    return true; // Indica que la cuenta ha sido bloqueada
  }
  return false; // Indica que la cuenta no ha sido bloqueada (aún)
}

async function resetAttempts(identifier) {
  await redis.del(`attempts:${identifier}`);
  // Opcional: También puedes resetear el blocked_count si un inicio de sesión exitoso significa "perdonar" bloqueos anteriores.
  // await redis.del(`blocked_count:${identifier}`);
}

router.post("/", async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).send("Faltan datos requeridos: identifier y password");
  }

  if (await isBlocked(identifier)) {
    // Si la cuenta está bloqueada, obtener el tiempo restante para informar al usuario
    const ttl = await redis.ttl(`blocked:${identifier}`); // Obtiene el tiempo de vida restante en segundos
    let remainingTimeText;
    if (ttl > 0) {
      if (ttl < 3600) {
        remainingTimeText = `${Math.ceil(ttl / 60)} minutos`;
      } else {
        remainingTimeText = `${(ttl / 3600).toFixed(1)} horas`;
      }
    } else {
      remainingTimeText = "un corto período"; // Fallback si TTL es 0 o negativo
    }
    return res
      .status(403)
      .send(
        `Cuenta bloqueada temporalmente. Intenta de nuevo en ${remainingTimeText}.`
      );
  }

  let query = identifier.includes("@")
    ? "SELECT * FROM usuario WHERE Email = ?"
    : "SELECT * FROM usuario WHERE Nombre_Usuario = ?";

  db.query(query, [identifier], async (err, result) => {
    if (err) {
      console.error("Error al obtener el usuario:", err);
      return res.status(500).send("Error interno del servidor");
    }

    // Inicializar userEmail y userName a null o valores por defecto
    let userEmail = null;
    let userName = null;
    if (result.length > 0) {
      userEmail = result[0].Email;
      userName = result[0].Nombre_Usuario;
    }

    if (result.length === 0) {
      // Si el usuario no existe, se registra el intento fallido.
      // No podemos enviar correo porque no tenemos un email válido.
      await registerFailedAttempt(identifier, userEmail, userName); // Pasa null para userEmail y userName
      return res.status(404).send("Usuario no encontrado");
    }

    const user = result[0];
    const passwordMatch = await bcrypt.compare(password, user.Contrasena);

    if (!passwordMatch) {
      // Si la contraseña es incorrecta, se registra el intento fallido.
      // Se pasa el email y nombre del usuario encontrado.
      const accountBlocked = await registerFailedAttempt(identifier, user.Email, user.Nombre_Usuario);
      if (accountBlocked) {
        // Si la función registerFailedAttempt indicó que la cuenta fue bloqueada
        // Es necesario recalcular el tiempo de bloqueo para la respuesta, ya que se acaba de bloquear
        const blockCount = await redis.get(`blocked_count:${identifier}`);
        const currentBlockTimeSeconds = calculateBlockTime(parseInt(blockCount) || 1); // Asegurar que sea al menos 1
        let blockDurationText;
        if (currentBlockTimeSeconds < 3600) {
          blockDurationText = `${Math.round(currentBlockTimeSeconds / 60)} minutos`;
        } else {
          blockDurationText = `${(currentBlockTimeSeconds / 3600).toFixed(1)} horas`;
        }
        return res.status(403).send(`Contraseña incorrecta. Cuenta bloqueada temporalmente por ${blockDurationText}.`);
      }
      return res.status(401).send("Contraseña incorrecta");
    }

    // Si la contraseña es correcta, restablece los intentos fallidos
    await resetAttempts(identifier);

    // 🔔 Enviar correo de notificación de inicio de sesión exitoso
    transporter.sendMail(
      {
        from: process.env.EMAIL_USER,
        to: user.Email,
        subject: "Inicio de sesión en Migibi Eats",
        html: `
          <p>Hola ${user.Nombre_Usuario},</p>
          <p>Alguien ha iniciado sesión en tu cuenta de <strong>Migibi Eats</strong>.</p>
          <p>Si no fuiste tú, por favor <strong>contacta con soporte inmediatamente</strong>.</p>
          <p>Gracias por usar nuestra app.</p>
          <p>Ya que esta utilizando Migibi Eats, le pedimos por favor que lea los términos</p>
          <p>y condiciones de nuestro servicio y los de la plataforma FatSecret, en caso de que no cumpla,</p>
          <p>la responsabilidad cae en usted.</p>
          <a href="https://platform.fatsecret.com/terms">Fatsecret</a>
          <a href="http://localhost:3000/">Migibi Eats</a>
          <a href="https://docs.google.com/document/d/1H_ErwiGDwcCGbRpqLP9WYxAw4cN0uSvMLzfPIk2dfd4/edit?usp=sharing">
          Terminos y condiciones | Aviso de privacidad</a>
          <hr/>
          <small>Este correo se envió automáticamente para tu seguridad.</small>
        `,
      },
      (error, info) => {
        if (error) {
          console.error("Error al enviar correo de inicio de sesión:", error);
        } else {
          console.log("Correo de inicio de sesión enviado:", info.response);
        }
      }
    );

    res.json({
      id: user.Id_Usuario,
      username: user.Nombre_Usuario,
      foto_perfil: user.foto_perfil,
      Cohabitantes: user.Cohabitantes,
      Email: user.Email,
      message: "Sesión iniciada con éxito",
    });
  });
});

module.exports = router;