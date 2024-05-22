import { HttpResponse } from '../middlewares/errors-handle.js';
import {searchMessages} from '../services/funciones.js';

const chatController = {};

chatController.mostrarChat = async (req, res) => {
  try {
    console.log("Chat")
    // Buscar todos los mensajes en la base de datos
    const mensajes = await searchMessages();
    res.render("chat", { title: "Chat", messages: mensajes, nombre: "Pedro"}); // Pasamos un array de mensajes a la plantilla
  } catch (error) {
    console.error(error);
    return HttpResponse.InternalServerError(res);
  }
};

export default chatController;