import { z } from 'zod';
import { tipoMascota } from '../config.js';

export const petSchema = z.object({
	nombre: z
		.string({
			message: 'Debes completar este campo',
		})
		.min(2, {
            message: 'El nombre debe tener al menos 2 caracteres',
        })
		.max(15, {
            message: 'El nombre debe tener menos de 15 caracteres',
        }),
	tipoMascota: z
		.number({
            message: 'Debes completar este campo',
        })
		.min(0)
		.max(tipoMascota.length - 1),
});
