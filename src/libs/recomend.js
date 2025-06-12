// src/libs/recommender.js
import nodemailer from 'nodemailer';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import User from '../models/user.model.js';
import Pet from '../models/pet.model.js';
import Service from '../models/service.model.js';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendWeeklyRecommendation = async () => {
  const users = await User.find();

  for (const user of users) {
    const pet = await Pet.findOne({ user: user._id });
    if (!pet) continue;

    const servicios = await Service.find({
      animales: { $in: [pet.tipo] },
    });

    const serviciosTexto = servicios.map(s => `- ${s.titulo}: ${s.descripcion} ($${s.precio})`).join('\n');

    const prompt = `
      Escribí un email simpático y breve para ${user.nombre} sobre su mascota ${pet.nombre} (tipo: ${pet.tipo}).
      Además, incluí una recomendación de estos servicios disponibles:\n${serviciosTexto}.
      El email debe ser amable y parecer personalizado, como si lo hubiera escrito un amigo; debe incluir un saludo, una breve introducción y una despedida amigable.
      Inclui en el final una oracion que diga: "ESTE ES UN TEXTO HECHO POR LA IA"; 
      `; //LA ULTIMA FRASE ES PARA QUE SE SEPA QUE EL MAIL SALIO DE ESTA FUNCION

    const response = await openai.chat.completions.create({
     model: "gpt-3.5-turbo",
     messages: [{ role: "user", content: prompt }],
        });

    const mensaje = response.choices[0].message.content;


    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Recomendaciones para ${pet.nombre} 🐾`,
      text: mensaje,
    });

    console.log(`📩 Email enviado a ${user.email}`);
  }
};
