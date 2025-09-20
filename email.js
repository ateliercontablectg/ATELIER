const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const router = express.Router();

// Validaciones
const validateContact = [
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('Debe ser un email válido'),
  body('subject').notEmpty().withMessage('El asunto es requerido'),
  body('message').notEmpty().withMessage('El mensaje es requerido')
];

// Configuración de Nodemailer - CORREGIDO
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Ruta para enviar correo
router.post('/send-email', validateContact, async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array()
      });
    }

    const { name, email, phone, subject, message } = req.body;

    // Configurar el transporte
    const transporter = createTransporter();

    // Configurar el email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.CONTACT_EMAIL,
      subject: `Nuevo mensaje de contacto: ${subject}`,
      html: `
        <h2>Nuevo mensaje de contacto desde el sitio web</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
        <p><strong>Asunto:</strong> ${subject}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
        <hr>
        <p>Este mensaje fue enviado desde el formulario de contacto de Atelier Contable</p>
      `
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

    // Enviar correo de confirmación al usuario
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirmación de contacto - Atelier Contable',
      html: `
        <h2>¡Gracias por contactarnos!</h2>
        <p>Hemos recibido tu mensaje y nos pondremos en contacto contigo pronto.</p>
        <p><strong>Resumen de tu mensaje:</strong></p>
        <p><strong>Asunto:</strong> ${subject}</p>
        <p><strong>Mensaje:</strong> ${message}</p>
        <hr>
        <p>Atentamente,<br>El equipo de Atelier Contable</p>
      `
    };

    await transporter.sendMail(userMailOptions);

    res.json({
      success: true,
      message: 'Correo enviado exitosamente'
    });

  } catch (error) {
    console.error('ERROR DETALLADO AL ENVIAR CORREO:');
    console.error('Mensaje:', error.message);
    console.error('Stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Error al enviar el correo: ' + error.message
    });
  }
});

module.exports = router;