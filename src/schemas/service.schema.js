import { z } from 'zod';

// Validación para crear un servicio
export const createServiceSchema = z
	.object({
		titulo: z
			.string({ message: 'Debes completar este campo' })
			.min(3, { message: 'El título debe tener al menos 3 caracteres' })
			.max(50, { message: 'El título debe tener menos de 50 caracteres' }),

		animales: z
			.array(z.string({ message: 'Tipo de animal inválido' }))
			.min(1, { message: 'Debes seleccionar al menos un tipo de animal' }),

		dias: z
			.array(z.string({ message: 'Día inválido' }))
			.min(1, { message: 'Debes seleccionar al menos un día' }),

		descripcion: z
			.string({ message: 'Debes completar este campo' })
			.min(10, { message: 'La descripción debe tener al menos 10 caracteres' })
			.max(200, { message: 'La descripción debe tener menos de 200 caracteres' }),

		precio: z
			.number({ message: 'El precio debe ser un número' })
			.min(1, { message: 'El precio debe ser mayor a 0' }),

		horaInicio: z
			.string({ message: 'Debes completar este campo' })
			.min(1, { message: 'Debes proporcionar la hora de inicio' }),

		horaFin: z // Nota: en el modelo es horaFin, en el controller también
			.string({ message: 'Debes completar este campo' })
			.min(1, { message: 'Debes proporcionar la hora de fin' }),

		domicilio: z.string().optional(),
		telefono: z.string().optional(),
		imagen: z.string().optional(),
		user: z.string().optional(), // El user se asigna en el controller, pero puede venir en algunos casos
	})
	.refine(
		(data) => {
			if (!data.horaInicio || !data.horaFin) return true;

			const [hIni, mIni] = data.horaInicio.split(':').map(Number);
			const [hFin, mFin] = data.horaFin.split(':').map(Number);

			const minutosInicio = hIni * 60 + mIni;
			const minutosFin = hFin * 60 + mFin;

			return minutosInicio < minutosFin;
		},
		{
			message: 'La hora de inicio debe ser menor a la hora de fin',
			path: ['horaInicio'],
		}
	);

// Validación para actualizar un servicio
export const updateServiceSchema = z
	.object({
		titulo: z
			.string({ message: 'El título debe ser un string' })
			.min(3, { message: 'El título debe tener al menos 3 caracteres' })
			.max(50, { message: 'El título debe tener menos de 50 caracteres' })
			.optional(),

		animales: z
			.array(z.string({ message: 'Tipo de animal inválido' }))
			.min(1, { message: 'Debes seleccionar al menos un tipo de animal' })
			.optional(),

		dias: z
			.array(z.string({ message: 'Día inválido' }))
			.min(1, { message: 'Debes seleccionar al menos un día' })
			.optional(),

		descripcion: z
			.string({ message: 'La descripción debe ser un string' })
			.min(10, { message: 'La descripción debe tener al menos 10 caracteres' })
			.max(200, { message: 'La descripción debe tener menos de 200 caracteres' })
			.optional(),

		precio: z
			.number({ message: 'El precio debe ser un número' })
			.min(1, { message: 'El precio debe ser mayor a 0' })
			.optional(),

		horaInicio: z
			.string({ message: 'La hora de inicio debe ser un string' })
			.min(1, { message: 'Debes proporcionar la hora de inicio' })
			.optional(),

		horaFin: z
			.string({ message: 'La hora de fin debe ser un string' })
			.min(1, { message: 'Debes proporcionar la hora de fin' })
			.optional(),

		domicilio: z.undefined(),
		telefono: z.undefined(),
		imagen: z.undefined(),
		user: z.undefined(), // No se permite actualizar el user desde aquí
	})
	.refine(
		(data) => {
			if (!data.horaInicio || !data.horaFin) return true;

			const [hIni, mIni] = data.horaInicio.split(':').map(Number);
			const [hFin, mFin] = data.horaFin.split(':').map(Number);

			const minutosInicio = hIni * 60 + mIni;
			const minutosFin = hFin * 60 + mFin;

			return minutosInicio < minutosFin;
		},
		{
			message: 'La hora de inicio debe ser menor a la hora de fin',
			path: ['horaInicio'],
		}
	);
