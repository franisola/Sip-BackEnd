import { MercadoPagoConfig, Preference, Payment as MP_Payment } from 'mercadopago';
import Payment from '../models/payment.model.js';
import Contract from '../models/contract.model.js';
import Service from '../models/service.model.js';

import mongoose from 'mongoose';

// Configuración del cliente MercadoPago (v2+)
const client = new MercadoPagoConfig({
	// accessToken: 'APP_USR-7297851103691134-053118-b131a9d74a68f896fd24f36b27c16cb1-358729445',
	// accessToken: "TEST-7297851103691134-053118-764dba12729bc385a4bcb7ba9739eaca-358729445",
	accessToken: 'APP_USR-6155944193323036-060318-092fe0438774d9d4383daf24353331ca-2473947693',
});

export const createPreference = async (req, res) => {
	const { fecha, precio, animal, serviceId, userId } = req.body;

	console.log(fecha, precio, animal, serviceId, userId)

	try {
		const preference = new Preference(client);

		const result = await preference.create({
			body: {
				items: [
					{
						title: `Reserva de servicio`,
						description: `Reserva para el ${fecha} con ${animal}`,
						quantity: 1,
						unit_price: precio, // Cambiar por el precio real cuando tengas
						currency_id: 'ARS',
					},
				],
				// redirect_urls: {
				// 	success: 'http://localhost:5173/',
				// 	failure: 'https://www.facebook.com/',
				// 	pending: 'https://www.instagram.com/',
				// },
				back_urls: {
					success: 'https://www.google.com/',
					failure: 'https://www.google.com/',
					pending: 'https://www.google.com/',
				},

				notification_url: 'https://f5f9-2800-2330-2940-1987-5847-2825-486e-563d.ngrok-free.app/webhook',
				auto_return: 'approved',
				metadata: {
					service: serviceId,
					cliente: userId,
					fecha,
					animal,
					precio,
				},
			},
		});

		console.log(`Preferencia creada con ID: ${result.id}`);

		res.status(200).json({ preferenceId: result.id });
	} catch (error) {
		console.error('Error al crear preferencia:', error);
		res.status(500).json({ error: 'Error al crear la preferencia de pago' });
	}
};

export const paymentWebhook = async (req, res) => {
	try {
		const { id, topic } = req.query;

		if (topic !== 'payment') {
			return res.status(200).send('Evento no relevante');
		}

		// Obtener los datos reales del pago
		const mpPayment = new MP_Payment(client);
		const payment = await mpPayment.get({ id });

		if (payment.status !== 'approved') {
			console.log('⚠️ Pago no aprobado:', payment.status);
			return res.status(200).send('Pago no aprobado');
		}

		const metadata = payment.metadata;
		const { service: servicioId, cliente, fecha, animal, precio } = metadata;

		if (!servicioId || !cliente || !fecha || !animal || !precio) {
			console.error('❌ Metadata incompleta');
			return res.status(400).send('Faltan datos en metadata');
		}

		// Verificar si ya existe el pago
		const existingPayment = await Payment.findOne({ mercadoPagoId: payment.id });
		if (existingPayment) {
			console.log('🔁 Pago ya registrado');
			return res.status(200).send('Pago ya registrado');
		}

		// Guardar el pago completo
		const nuevoPago = await Payment.create({
			mercadoPagoId: payment.id,
			status: payment.status,
			amount: payment.transaction_amount,
			method: payment.payment_method_id,
			payerEmail: payment.payer?.email,
			metadata,
			rawData: payment, // opcional pero útil para depurar
		});

		// Verificar si ya existe contrato para este pago
		const contratoExistente = await Contract.findOne({ pago: nuevoPago._id });
		if (contratoExistente) {
			console.log('🔁 Contrato ya creado');
			return res.status(200).send('Contrato ya existe');
		}

		// Obtener proveedor desde el servicio
		const servicio = await Service.findById(servicioId);
		if (!servicio) {
			return res.status(404).send('Servicio no encontrado');
		}

		// Crear contrato

		const nuevoContrato = await Contract.create({
			servicio: new mongoose.Types.ObjectId(servicioId),
			cliente: new mongoose.Types.ObjectId(cliente),
			proveedor: servicio.user,
			fecha: new Date(fecha),
			animal: new mongoose.Types.ObjectId(animal),
			precio,
			pago: nuevoPago._id,
		});

		console.log('✅ Contrato creado con éxito:', nuevoContrato._id);
		return res.status(200).send('Pago y contrato procesados');
	} catch (error) {
		console.error('❌ Error en webhook:', error.message);
		return res.status(500).send('Error interno del servidor');
	}
};

// https://2c31-2802-8010-3102-e701-d02-8bdf-e60f-15e9.ngrok-free.app/webhook

//Dueño de la cuenta
// TESTUSER1153858536

// Tl4u3SrczH

//Cuenta que paga
// TESTUSER208300560
// MFd2bg6AsD
