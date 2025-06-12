import { z } from 'zod';

export const registerSchema = z.object({
	nombre: z
		.string({
			message: 'Debes completar este campo',
		})
		.min(3, {
			message: 'El nombre debe tener al menos 3 caracteres',
		})
		.max(30, {
			message: 'El nombre debe tener como máximo 30 caracteres',
		}),

	apellido: z
		.string({
			message: 'Debes completar este campo',
		})
		.min(3, {
			message: 'El apellido debe tener al menos 3 caracteres',
		})
		.max(30, {
			message: 'El apellido debe tener como máximo 30 caracteres',
		}),

	email: z
		.string({
			message: 'Debes completar este campo',
		})
		.email({
			message: 'El email debe ser un email válido',
		}),

	contrasena: z
		.string({
			message: 'Debes completar este campo',
		})
		.min(6, {
			message: 'La contraseña debe tener al menos 6 caracteres',
		}),
	telefono: z
		.string({
			message: 'Debes completar este campo',
		})
		.min(10, {
			message: 'El teléfono es invalido',
		})
		.max(10, {
			message: 'El teléfono es invalido',
		})
		.refine((val) => val.startsWith('11') || val.startsWith('15'), {
			message: 'El teléfono debe comenzar con 11 o 15',
		}),

	domicilio: z
		.string({
			message: 'Debes completar este campo',
		})
		.min(3, {
			message: 'El domicilio debe tener al menos 3 caracteres',
		})
		.max(100, {
			message: 'El domicilio debe tener como máximo 100 caracteres',
		}),
	foto: z.undefined(), // No se puede enviar en el registro
});

export const loginSchema = z.object({
	email: z
		.string({
			message: 'Debes completar este campo',
		})
		.email({
			message: 'El email debe ser un email válido',
		}),

	contrasena: z
		.string({
			message: 'Debes completar este campo',
		})
		.min(6, {
			message: 'La contraseña debe tener al menos 6 caracteres',
		}),
	nombre: z.undefined(), // No se puede enviar en el login
	apellido: z.undefined(), // No se puede enviar en el login
	telefono: z.undefined(), // No se puede enviar en el login
	domicilio: z.undefined(), // No se puede enviar en el login
	foto: z.undefined(), // No se puede enviar en el login

});

export const editProfileSchema = z.object({
	nombre: z
		.string({
			message: 'Debes completar este campo',
		})
		.min(3, {
			message: 'El nombre debe tener al menos 3 caracteres',
		})
		.max(30, {
			message: 'El nombre debe tener como máximo 30 caracteres',
		}),

	apellido: z
		.string({
			message: 'Debes completar este campo',
		})
		.min(3, {
			message: 'El apellido debe tener al menos 3 caracteres',
		})
		.max(30, {
			message: 'El apellido debe tener como máximo 30 caracteres',
		}),
	domicilio: z
		.string({
			message: 'El domicilio debe ser un string',
		})
		.min(3, {
			message: 'El domicilio debe tener al menos 3 caracteres',
		})
		.max(100, {
			message: 'El domicilio debe tener como máximo 100 caracteres',
		})
		.optional(),
	telefono: z
		.string({
			message: 'Debes completar este campo',
		})
		.min(10, {
			message: 'El teléfono es invalido',
		})
		.max(10, {
			message: 'El teléfono es invalido',
		})
		.refine((val) => val.startsWith('11') || val.startsWith('15'), {
			message: 'El teléfono debe comenzar con 11 o 15',
		})
		.optional(),
	foto: z.string().optional(),
	email: z.undefined(), // No se puede enviar en la edición de perfil
	contrasena: z.undefined(), // No se puede enviar en la edición de perfil
});
