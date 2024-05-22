import express from 'express';
import { ensureUser } from '../services/funciones.js';
import cartController from '../controllers/cartController.js';

const router = express.Router();

router.delete('/:id', ensureUser, cartController.deleteAllProductos);
router.delete('/:idCarrito/productos/:idProducto', ensureUser, cartController.deleteProductoDelCarrito);
router.post('/', ensureUser, cartController.crearNuevoCarrito);
router.post("/:idCarrito/productos/:idProducto", ensureUser, cartController.agregarProductoAlCarrito);
router.get('/:id', ensureUser, cartController.mostrarCarrito);
router.post('/:id/purchase', cartController.terminarCompra);

export default router;
