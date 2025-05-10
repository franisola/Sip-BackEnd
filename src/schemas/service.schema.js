import { z } from 'zod';
import { categoria, frecuencia, tipoMascota, estado } from '../config.js';

export const createServiceSchema = z.object({
	nombre: z
		.string({
			message: 'Debes completar este campo',
		})
		.min(3, {
			message: 'El nombre debe tener al menos 3 caracteres',
		})
		.max(30, {
			message: 'El nombre debe tener menos de 30 caracteres',
		}),
	categoria: z
		.string({
			message: 'Debes completar este campo',
		})
		.refine((value) => categoria.includes(value)),

	frecuencia: z
		.string({
			message: 'Debes completar este campo',
		})
		.refine((value) => frecuencia.includes(value)),

	tipoMascota: z
		.string({
			message: 'Debes completar este campo',
		})
		.refine((value) => tipoMascota.includes(value), {
			message: 'Tipo invalido',
		}),

	costoHR: z
		.number({
			message: 'El costo por hora debe ser un número',
		})
		.min(1),

	estado: z
		.string({
			message: 'Debes completar este campo',
		})
		.refine((value) => estado.includes(value), {
			message: 'Tipo invalido',
		}),

	descripcion: z
		.string({
			message: 'Debes completar este campo',
		})
		.min(10, {
            message: 'La descripción debe tener al menos 10 caracteres',
        })
		.max(200, {
            message: 'La descripción debe tener menos de 200 caracteres',
        }),

	user: z.undefined(),
	calificacion: z.undefined(),
});

export const updateServiceSchema = z.object({
	nombre: z
		.string({
			message: 'El nombre debe ser un string',
		})
		.min(3, {
			message: 'El nombre debe tener al menos 3 caracteres',
		})
		.max(30, {
			message: 'El nombre debe tener menos de 30 caracteres',
		})
		.optional(),

	categoria: z
		.string({
			message: 'La categoria debe ser un string',
		})
		.refine((value) => categoria.includes(value))
		.optional(),

	frecuencia: z
		.string({
			message: 'La frecuencia debe ser un string',
		})
		.refine((value) => frecuencia.includes(value))
		.optional(),

	tipoMascota: z
		.string({
			message: 'El tipo de mascota debe ser un string',
		})
		.refine((value) => tipoMascota.includes(value), {
			message: 'Tipo invalido',
		})
		.optional(),

	costoHR: z
		.number({
			message: 'El costo por hora debe ser un número',
		})
		.min(1, {
            message: 'El costo por hora debe ser mayor a 0',
        })
		.optional(),

	estado: z
		.string({
			message: 'El estado debe ser un string',
		})
		.refine((value) => estado.includes(value), {
			message: 'Tipo invalido',
		})
		.optional(),

	descripcion: z
		.string({
			message: 'La descripción debe ser un string',
		})
		.min(10, {
            message: 'La descripción debe tener al menos 10 caracteres',
        })
		.max(200, {
            message: 'La descripción debe tener menos de 200 caracteres',
        })
		.optional(),

	user: z.undefined(),
	calificacion: z.undefined(),
});
