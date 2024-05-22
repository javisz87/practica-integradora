import express from 'express';
import { ensureAuthenticated } from '../services/funciones.js';
import mockingController from '../controllers/mockingController.js'; // Importa el controlador para la lógica de la página de inicio

const router = express.Router();

router.get('/', ensureAuthenticated, mockingController.getMocking);

export default router;
