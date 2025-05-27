import mercadopago from 'mercadopago';
import Contract from '../models/contract.model.js';
import Service from '../models/service.model.js';
import Payment from '../models/payment.model.js';

// mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);

export const createPreference = async (req, res) => {
    console.log("hola");
    
	try {
		const { fecha, horarioInicio, horarioFin, serviceId } = req.body;


		const service = await Service.findById(serviceId);
		if (!service) return res.status(404).json({ msg: 'Servicio no encontrado' });


		const cliente = req.user.id;
		const proveedor = service.user._id; 


		const preference = {
			items: [
				{
					title: `Servicio: ${service.name || servicio}`,
					unit_price: service.precio,
					quantity: 1,
				},
			],
			back_urls: {
				success: `${process.env.FRONTEND_URL}/payment/success`,
				failure: `${process.env.FRONTEND_URL}/payment/failure`,
				pending: `${process.env.FRONTEND_URL}/payment/pending`,
			},
			auto_return: 'approved',
			metadata: {
				service,
				cliente,
				proveedor,
				fecha,
				horarioInicio,
				horarioFin,
			},
		};

		const response = await mercadopago.preferences.create(preference);

		return res.status(201).json({ preferenceId: response.body.id });
	} catch (error) {
		console.error('Error creating MP preference:', error);
		return res.status(500).json({ message: 'Error creating payment preference' });
	}
};

/**
 * Webhook para recibir notificaciones de Mercado Pago y crear contrato
 */
export const paymentWebhook = async (req, res) => {
	try {
		// Mercado Pago envía el query param "topic" y "id"
		const { id, topic } = req.query;

		if (topic !== 'payment') {
			return res.status(200).send('No action for this topic');
		}

		// Obtener datos del pago desde Mercado Pago
		const paymentResponse = await mercadopago.payment.findById(id);
		const paymentData = paymentResponse.body;

		// Guardar o actualizar pago en BD
		let payment = await Payment.findOne({ mercadoPagoId: paymentData.id });

		if (!payment) {
			payment = new Payment({
				mercadoPagoId: paymentData.id,
				status: paymentData.status,
				amount: paymentData.transaction_amount,
				method: paymentData.payment_method_id,
				payerEmail: paymentData.payer.email,
				metadata: paymentData.metadata,
				rawData: paymentData,
			});
		} else {
			payment.status = paymentData.status;
			payment.amount = paymentData.transaction_amount;
			payment.method = paymentData.payment_method_id;
			payment.payerEmail = paymentData.payer.email;
			payment.metadata = paymentData.metadata;
			payment.rawData = paymentData;
		}

		await payment.save();

		// Si el pago está aprobado, crear contrato si no existe aún
		if (payment.status === 'approved') {
			const existingContract = await Contract.findOne({ pago: payment._id });

			if (!existingContract) {
				const { servicio, cliente, proveedor, fecha, horarioInicio, horarioFin } =
					payment.metadata;

				const newContract = new Contract({
					servicio,
					cliente,
					proveedor,
					fecha,
					horarioInicio,
					horarioFin,
					pago: payment._id,
				});

				await newContract.save();
			}
		}

		return res.status(200).send('Payment processed');
	} catch (error) {
		console.error('Error processing MP webhook:', error);
		return res.status(500).send('Internal server error');
	}
};
