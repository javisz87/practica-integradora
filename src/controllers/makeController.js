import { cargarProducto, deleteProductsPorId, modificarProductoPorId, searchProductsPorId2 } from "../services/funciones.js";
import { HttpResponse } from '../middlewares/errors-handle.js';

const makeController = {};

makeController.makeProduct = async (req, res, next) => {
  try {
    console.log("make");
    res.render("make", { title: "Make handelbars" });
  } catch (error) {
    console.error('Error al generar productos de ejemplo:', error);
    res.redirect("/make");
  }
};

makeController.crearProducto = async (req, res, next) => {
  try {
    console.log("crearProducto");

    const { titulo, descripcion, code, precio, cantidad, marca, categoria, demografia } = req.body;

    if (req.user.rol === "premium") {
      const producto = {
        titulo: titulo,
        descripcion: descripcion,
        code: code,
        precio: precio,
        cantidad: cantidad,
        marca: marca,
        categoria: categoria,
        demografia: demografia,
        owner: req.user.email
      }

      console.log(producto);

      await cargarProducto(producto);
    } else {
      const producto = {
        titulo: titulo,
        descripcion: descripcion,
        code: code,
        precio: precio,
        cantidad: cantidad,
        marca: marca,
        categoria: categoria,
        demografia: demografia,
      }

      console.log(producto);

      await cargarProducto(producto);
    }

    res.render("make", { title: "Make handelbars" });
  } catch (error) {
    console.error("Error al crear el usuario:", error.message);
    res.redirect("/log");
  }
};

makeController.borrarProducto = async (req, res, next) => {
  try {
    console.log("borrarProducto");

    const { idProducto } = req.body;

    console.log(idProducto)

    if (req.user.rol === "premium") {

      console.log("si");

      const pro = await searchProductsPorId2(idProducto)

      if (req.user.email == pro.owner) {

        await deleteProductsPorId(idProducto)

        res.render("make", { title: "Make handelbars" });

      }
      else {
        console.log("no tienes permitido modificar este producto")
      }
    } else {

      await deleteProductsPorId(idProducto)

      res.render("make", { title: "Make handelbars" });
    }



  } catch (error) {
    console.error("Error al crear el usuario:", error.message);
    res.redirect("/log");
  }
};

makeController.modificarProducto = async (req, res, next) => {
  try {
    console.log("modificarProducto");

    const { idProducto, campo, valor } = req.body;

    if (req.user.rol === "premium") {

      const pro = await searchProductsPorId2(idProducto)

      if (req.user.email == pro.owner) {

        console.log(idProducto)
    
        await modificarProductoPorId(idProducto, campo, valor)

      }
      else {
        console.log("no tienes permitido modificar este producto")
      }

    } else {

      console.log(idProducto)
  
      await modificarProductoPorId(idProducto, campo, valor)
      }

    res.render("make", { title: "Make handelbars" });
  } catch (error) {
    console.error("Error al crear el usuario:", error.message);
    res.redirect("/log");
  }
};

export default makeController;
