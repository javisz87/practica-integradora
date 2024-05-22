import { searchProductsPorId2, searchUserPorId } from '../services/funciones.js';
import Product from '../model/producto.model.js'; // Importa el modelo Product
import { ErrorDictionary, HttpResponse } from "../middlewares/errors-handle.js";

const productController = {};

// Función para ver un producto por ID
productController.getProductById = async (req, res) => {
  try {
    const userId = req.session.passport.user;
    const idProducto = parseInt(req.params.id, 10);
    console.log("aca")
    console.log(idProducto)
    // Validar userId
    if (!idProducto || isNaN(idProducto) || idProducto < 0) {
      console.log("aca")
      return HttpResponse.BadRequest(res, 'INVALID_PARAMS_ERROR');
    }
    const producto = await searchProductsPorId2(idProducto);

    if (!producto) {
      return HttpResponse.NotFound(res, 'PRODUCT_NOT_FOUND');
    }

    let user; // Declaración de la variable user fuera del bloque if

    if (userId != 1) {
      user = await searchUserPorId(userId);
    } else {
      user = admin; // Asegúrate de tener definida la variable admin en tu código
    }

    res.render("producto", { title: 'Producto', producto: producto, user: user });

  } catch (error) {
    console.error(error);
    return HttpResponse.InternalServerError(res);
  }
};

// Función para borrar un producto por ID
productController.deleteProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return HttpResponse.NotFound(res, 'PRODUCT_NOT_FOUND');
    }
    
    return HttpResponse.OK(res, 'PRODUCT_DELETED', 'Producto eliminado correctamente');
  } catch (error) {
    console.error(error);
    return HttpResponse.InternalServerError(res);
  }
};

export default productController;

