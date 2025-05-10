import { z } from 'zod';

export const commentSchema = z.object({

    comentario: z.string({
        message: 'Debes completar este campo',
    }).min(10).max(255),
    calificacion: z.number({
        message: 'calificacion invalida',
    }).int().min(1).max(5),

    fecha: z.undefined(),

});