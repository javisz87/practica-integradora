import { searchUserPorId } from '../services/funciones.js';
import { HttpResponse } from '../middlewares/errors-handle.js';

const admin = {
  name: process.env.adminName,
  lastName: process.env.adminLastName,
  email: process.env.adminEmail,
  cart: process.env.adminCart,
  rol: process.env.adminRol
};

const currentController = {};

currentController.mostrarUsuarioActual = async (req, res) => {
  try {
    const userId = req.session.passport.user;
    let user;

    if (userId != 1) {
      user = await searchUserPorId(userId);
    } else {
      user = admin;
    }

    console.log(user)

    res.render("current", { title: "Usuario actual", user: user });
  } catch (error) {
    console.error(error);
    return HttpResponse.InternalServerError(res);
  }
};

export default currentController;
