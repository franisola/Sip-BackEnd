import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendWelcomeEmail = async (user) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: '🎉 ¡Bienvenido a PetSiter!',
    text: `Hola ${user.nombre}, gracias por registrarte en nuestra plataforma. ¡Esperamos que disfrutes la experiencia! 🐾
    Somos mucho más que una aplicación de cuidado de mascotas, somos una comunidad de amantes de los animales que se ayudan entre sí.`,
  };
  await transporter.sendMail(mailOptions);
};

// OPCIONAL PERO ME PARECE INCOMODO TENER QUE ENVIAR UN EMAIL CADA VEZ QUE SE HACE LOGIN
export const sendChangePasswordNotification = async (user) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: '🔐 Cambio de contraseña detectado',
    text: `Hola ${user.nombre}, detectamos un cambio de contraseña en tu cuenta. Si no fuiste vos, contactanos de inmediato.`,
  };
  await transporter.sendMail(mailOptions);
};

export const sendServiceConfirmation = async (user, service) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: `✅ Confirmación de servicio: ${service.titulo}`,
    text: `Hola ${user.nombre}, confirmamos que contrataste el servicio "${service.titulo}". Precio: $${service.precio}. Gracias por confiar en PetSiter 🐶`,
  };
  await transporter.sendMail(mailOptions);
};

export const sendInvoiceEmail = async (userEmail, contrato, pago) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: `🧾 Factura de tu servicio contratado`,
    html: `
      <h2>Factura de Servicio</h2>
      <p><b>Servicio:</b> ${contrato.servicio.titulo}</p>
      <p><b>Proveedor:</b> ${contrato.proveedor.nombre} ${contrato.proveedor.apellido}</p>
      <p><b>Cliente:</b> ${contrato.cliente.nombre} ${contrato.cliente.apellido}</p>
      <p><b>Animal:</b> ${contrato.animal.nombre || contrato.animal._id}</p>
      <p><b>Fecha:</b> ${new Date(contrato.fecha).toLocaleDateString()}</p>
      <p><b>Precio:</b> $${contrato.precio}</p>
      <p><b>ID de pago:</b> ${pago.mercadoPagoId}</p>
      <p><b>Estado del pago:</b> ${pago.status}</p>
      <hr>
      <p>Gracias por confiar en PetSiter 🐾</p>
    `,
  };
  await transporter.sendMail(mailOptions);
};
