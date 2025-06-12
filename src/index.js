import app from './app.js';
import { connectDB } from './db.js';
import cron from 'node-cron';
import { sendWeeklyRecommendation } from './libs/recomend.js';

// Ejecutar una vez inmediatamente al correr el archivo
connectDB();
app.listen(3001);
console.log('Server on port', 3001);

sendWeeklyRecommendation();

// 🕒 Programar para todos los lunes a las 9:00 AM
// cron.schedule('*/3 * * * *', async () => { ENVIA CADA 3 MINUTOS
cron.schedule('0 17 * * 4', async () => { // Cada jueves a las 17:00 
  console.log('⏰ Enviando recomendaciones semanales...');
  await sendWeeklyRecommendation();
});