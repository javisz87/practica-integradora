import express from 'express';
import registerController from '../controllers/registerController.js'; // Importa el controlador para la ruta de creación de usuarios

const router = express.Router();

router.post('/', registerController.createUser);

export default router;

