import express from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import User from '../model/user.model.js';
import { ErrorDictionary, HttpResponse } from "../middlewares/errors-handle.js";

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Función para enviar el correo de restablecimiento de contraseña
const sendResetEmail = async (email, token) => {
  const resetUrl = `http://localhost:${process.env.PORT}/reset-password/${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Restablecimiento de Contraseña',
    text: `Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetUrl}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo de restablecimiento enviado');
  } catch (error) {
    console.error('Error al enviar el correo de restablecimiento:', error);
  }
};

const passwordResetController = {};

// Endpoint para solicitar el restablecimiento de contraseña
passwordResetController.requestReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return HttpResponse.NotFound(res, 'USER_NOT_FOUND');
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hora
    await user.save();

    await sendResetEmail(email, token);
    return HttpResponse.OK(res, 'Correo de restablecimiento enviado', { email });
  } catch (error) {
    console.error("Error al crear el usuario:", error.message);
    res.redirect("/log");
  }
};

// Endpoint para restablecer la contraseña
passwordResetController.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return HttpResponse.BadRequest(res, 'INVALID_OR_EXPIRED_TOKEN');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    return HttpResponse.OK(res, 'Contraseña restablecida correctamente');
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    return HttpResponse.InternalServerError(res, 'INTERNAL_SERVER_ERROR');
  }
};

export default passwordResetController;