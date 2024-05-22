import express from "express";
import { engine } from "express-handlebars";
import { __dirname } from "./utils.js";
import * as path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";
import "./utilities/connection.js";
import { config } from 'dotenv';
import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Server } from "socket.io";
import bcrypt from 'bcryptjs';
import Users from './model/user.model.js'; // Importa el modelo User
import { passwordResetRoutes, productosRoutes, cartRoutes, currentRoutes, authRoutes, logRoutes, loginRoutes, registerRoutes, logoutRoutes, Routes, chatRoutes, makeRoutes, mockingRoutes } from './routes/index.js';
import Message from './model/message.model.js'; // Importa el modelo Message
import winston from "winston";/* 
import passwordResetRoutes from './routes/passwordReset.Routes.js'; */

config();//

const admin = {
  name: process.env.adminName,
  lastName: process.env.adminLastName,
  email: process.env.adminEmail,
  cart: process.env.adminCart,
  rol: process.env.adminRol
};

const PORT = process.env.PORT;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

//Configuraciones

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.secreto));
app.use(session({
  secret: process.env.secreto, // Cambia esto por una cadena de caracteres segura
  resave: true, //
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

const server = app.listen(PORT, () => { console.log(`Server run Express port: ${PORT}`); });
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado", socket.id);
})

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));
app.use("/", express.static(__dirname + "/public"));

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  try {
    // Verificar si las credenciales corresponden al administrador
    if (email === admin.email && password === process.env.adminPassword) {
      const admin = {
        _id: 1,
        name: process.env.adminName,
        lastName: process.env.adminLastName,
        email: process.env.adminEmail,
        cart: process.env.adminCart,
        rol: process.env.adminRol
      };
      return done(null, admin);
    }

    // Buscar al usuario en la base de datos por su correo electrónico
    const usuario = await Users.findOne({ email });

    if (!usuario) {
      // Si el usuario no existe, devolver un error
      return done(null, false, { message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña del usuario utilizando bcrypt
    const isPasswordValid = await bcrypt.compare(password, usuario.password);

    if (isPasswordValid) {
      // Si la contraseña es válida, devolver el usuario
      return done(null, usuario);
    } else {
      // Si la contraseña no es válida, devolver un mensaje de error
      return done(null, false, { message: 'Contraseña incorrecta' });
    }
  } catch (error) {
    // Si ocurre un error, devolver el error
    return done(error);
  }
}));

passport.serializeUser((usuario, done) => {
  // Serializa el usuario para almacenarlo en la sesión
  done(null, usuario._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    if (id === 1) {
      // Si el ID es 1, devolver el usuario administrador
      const admin = {
        _id: 1,
        name: process.env.adminName,
        lastName: process.env.adminLastName,
        email: process.env.adminEmail,
        cart: process.env.adminCart,
        rol: process.env.adminRol
      };
      return done(null, admin);
    }

    // De lo contrario, buscar al usuario en la base de datos
    const usuario = await Users.findById(id);
    done(null, usuario);
  } catch (error) {
    done(error);
  }
});

// Configuración del logger
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(), // Salida a la consola
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Registro de errores en archivo
    new winston.transports.File({ filename: 'logs/combined.log' }) // Registro de todos los niveles en archivo
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`)
  )
});

// Ejemplo de uso del logger
logger.error('Este es un mensaje de error.');
logger.warn('Este es un mensaje de advertencia.');
logger.info('Este es un mensaje de información.');
logger.debug('Este es un mensaje de depuración.');

// Middleware de Passport para inicializar y manejar las sesiones
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: process.env.callbackURL
},
  async (accessToken, refreshToken, profile, done) => {
    // Aquí puedes manejar la autenticación de usuario
    console.log(profile._json.email)
    const email = profile._json.email;

    // Buscar al usuario en la base de datos por su correo electrónico
    const usuario = await Users.findOne({ email });

    console.log(usuario)

    if (!usuario) {
      // Si el usuario no existe, devolver un error
      return done(null, false, { message: 'Usuario no encontrado' });
    }

    return done(null, usuario);
  }
));


// Usa las rutas definidas en index.js
app.use('/', Routes);
app.use('/productos', productosRoutes);
app.use('/carts', cartRoutes);
app.use('/current', currentRoutes);
app.use('/log', logRoutes);
app.use('/auth', authRoutes);
app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/logout', logoutRoutes);
app.use('/chat', chatRoutes);
app.use('/make', makeRoutes);
app.use('/mocking', mockingRoutes);
app.use('/password-reset', passwordResetRoutes); //

// Configurar Socket.io
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  // Manejar el evento de nuevo mensaje del cliente
  socket.on('chat message', async (msg) => {
    console.log('Mensaje recibido:', msg);

    // Crea un nuevo mensaje con los datos proporcionados
    const newMessage = new Message({
      user: msg.username,
      message: msg.message
    });

    // Guarda el nuevo mensaje en la base de datos
    await newMessage.save();

    // Emitir el mensaje a todos los clientes conectados
    io.emit('chat message', msg);
  });
});