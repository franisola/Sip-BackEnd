import { z } from 'zod';
import { contractState } from '../config.js';

export const createContractSchema = z
	.object({
		fechaInicio: z
			.string({
				message: 'Debes completar este campo',
			})
			.refine(
				(fecha) => {
					const fechaInicio = new Date(fecha);
					const ahora = new Date();
					ahora.setUTCHours(0, 0, 0, 0); // Establece la hora a 00:00:00.000 UTC
					const tresDiasMas = new Date(
						Date.UTC(
							ahora.getUTCFullYear(),
							ahora.getUTCMonth(),
							ahora.getUTCDate() + 3
						)
					);
					return fechaInicio >= tresDiasMas;
				},
				{
					message: 'La fecha de inicio debe ser al menos 3 días después de hoy.',
				}
			),
		fechaFin: z.string().optional(),
		horarioReferencia: z
			.string({
				message: 'Debes completar este campo',
			})
			.min(5, {
				message: 'El horario de referencia debe tener al menos 5 caracteres',
			})
			.max(50, {
				message: 'El horario de referencia debe tener menos de 50 caracteres',
			}),
		motivoDelServicio: z
			.string({
				message: 'Debes completar este campo',
			})
			.min(10, {
                message: 'El motivo del servicio debe tener al menos 10 caracteres',
            })
			.max(255, {
                message: 'El motivo del servicio debe tener menos de 255 caracteres',
            }),

		estado: z.undefined(),
		user: z.undefined(),
		service: z.undefined(),
	})
	.refine(
		(value) => {

            if(!value.fechaFin) return true;

			const fechaInicio = new Date(value.fechaInicio);
			const fechaFin = new Date(value.fechaFin);

			return fechaFin >= fechaInicio;
		},
		{ message: 'La fecha de fin debe ser igual o posterior a la fecha de inicio.' }
	);

export const updateContractSchema = z.object({
	estado: z.string().refine((value) => contractState.includes(value), {
		message: 'Estado invalido',
	}),

	fechaInicio: z.undefined(),
	fechaFin: z.undefined(),
	horarioReferencia: z.undefined(),
	motivoDelServicio: z.undefined(),
	user: z.undefined(),
	service: z.undefined(),
});
