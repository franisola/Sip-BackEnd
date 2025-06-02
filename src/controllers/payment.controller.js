import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: 'TEST-7297851103691134-053118-764dba12729bc385a4bcb7ba9739eaca-358729445',
});

export const createPreference = async (req, res) => {
  const { fecha, horarioInicio, horarioFin, serviceId } = req.body;

  try {
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            title: `Servicio hola`,
            description: `Reserva para el ${fecha} de ${horarioInicio} a ${horarioFin}`,
            quantity: 1,
            unit_price: 1,
            currency_id: 'ARS',
          },
        ],
        back_urls: {
          success: 'https://www.google.com/',
		  failure: 'https://www.google.com/',
		  pending: 'https://www.google.com/',
        },
        auto_return: 'approved',
      },
    });

    const preferenceId = result.id;

	console.log(`Preferencia creada con ID: ${preferenceId}`);
	
	
	
    res.status(200).json({ preferenceId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la preferencia de pago' });
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
				const { service, cliente, proveedor, fecha, horarioInicio, horarioFin } =
					payment.metadata;

				const newContract = new Contract({
					service,
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
