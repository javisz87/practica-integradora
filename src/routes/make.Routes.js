import express from 'express';
import { ensureAdmin, ensureAdminPremium } from '../services/funciones.js';
import makeController from '../controllers/makeController.js'; // Importa el controlador para la lógica de productos

const router = express.Router();

// Ruta para ver un solo producto por ID
router.get('/', ensureAdminPremium, makeController.makeProduct);
router.post('/crear', ensureAdminPremium, makeController.crearProducto);
router.post('/borrar', ensureAdminPremium, makeController.borrarProducto);
router.post('/modificar', ensureAdminPremium, makeController.modificarProducto);

export default router;

