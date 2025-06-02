import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
export default app;

// Midlewares
app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	})
);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes

import usersRoute from './routes/users.routes.js';
import petsRoute from './routes/pets.routes.js';
import servicesRoute from './routes/services.routes.js';
import commentsRoute from './routes/comments.routes.js';
import contractsRoute from './routes/contracts.routes.js';
import paymentRoute from './routes/payment.routes.js';

app.use(usersRoute);
app.use(petsRoute);
app.use(servicesRoute);
app.use(commentsRoute);
app.use(contractsRoute);
app.use(paymentRoute);

app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const error = err || 'Internal Server Error';
	return res.status(statusCode).json({
		success: false,
		error,
		statusCode,
	});
});

// import { MercadoPagoConfig, Preference } from 'mercadopago';
// // ✅ Crear instancia de MercadoPago

// const mp = new MercadoPagoConfig({
// 	accessToken: 'TEST-630777054265325-052322-e677682969054d09d8ba49719279ec0a-249294638',
// });

// const preference = new Preference(mp);

// app.post('/create_preference', async (req, res) => {
// 	const { description, price, quantity } = req.body;

// 	try {
// 		const result = await preference.create({
// 			body: {
// 				items: [
// 					{
// 						title: description || 'Producto sin nombre',
// 						unit_price: Number(price) || 1,
// 						quantity: Number(quantity) || 1,
// 					},
// 				],
// 				back_urls: {
// 					success: 'https://google.com',
// 					failure: 'https://google.com',
// 				},
// 				auto_return: 'approved',

// 				// 🔒 Bloqueamos todo excepto tarjetas
// 				excluded_payment_methods: [
// 					{ id: 'account_money' },   // Saldo en cuenta
// 					{ id: 'ticket' },          // Pago fácil, Rapipago
// 					{ id: 'bank_transfer' },   // Transferencia
// 					{ id: 'atm' },             // Cajero automático
// 				],
// 			},
// 		});

// 		res.json({ id: result.id });
// 	} catch (error) {
// 		console.error('❌ Error al crear la preferencia:', error);
// 		res.status(500).json({ error: error.message });
// 	}
// });




