import express from 'express';
import passwordResetController from '../controllers/passwordResetController.js';

const router = express.Router();

router.post('/request-reset', passwordResetController.requestReset);
router.post('/reset-password/:token', passwordResetController.resetPassword);

export default router;
