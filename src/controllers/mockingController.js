import { searchUserPorId, generateRandomCode, getRandomElement } from '../services/funciones.js';
import { HttpResponse } from '../middlewares/errors-handle.js';

const admin = {
  name: process.env.adminName,
  lastName: process.env.adminLastName,
  email: process.env.adminEmail,
  cart: process.env.adminCart,
  rol: process.env.adminRol
};

const mockingController = {};

mockingController.getMocking = async (req, res) => {
  try {
    const userId = req.session.passport.user;
    let user;

    if (userId != 1) {
      user = await searchUserPorId(userId);
    } else {
      user = admin;
    }

    const products = [];
    const marcas = ['marca1', 'marca2', 'marca3'];
    const categorias = ['categoria1', 'categoria2', 'categoria3'];
    const demografias = ['u', 'm', 'h', 'n'];

    for (let i = 0; i < 100; i++) {
      const product = {
        id: i + 1,
        title: `Producto ${i + 1}`,
        descripcion: `Descripción del Producto ${i + 1}`,
        code: generateRandomCode(), // Debes implementar esta función para generar códigos únicos
        price: Math.floor(Math.random() * 10000) + 1,
        estado: true,
        cantidad: 10,
        marca: getRandomElement(marcas), // Función para obtener un elemento aleatorio del array
        categoria: getRandomElement(categorias), // Función para obtener un elemento aleatorio del array
        demografia: getRandomElement(demografias), // Función para obtener un elemento aleatorio del array
        imagen: `Imagen del Producto ${i + 1}`
      };
      products.push(product);
    }

    res.render("mockingproducts", { title: "Mocking handelbars", productos: products, user: user }); // Renderiza la plantilla con los productos
  } catch (error) {
    console.error(error);
    return HttpResponse.InternalServerError(res);
  }
};

export default mockingController;