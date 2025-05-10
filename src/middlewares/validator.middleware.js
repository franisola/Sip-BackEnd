import { z } from 'zod';


export const validateSchema = (schema) => (req, res, next) => {
	try {

        
        schema.parse(req.body);
		next();
	} catch (error) {
        // console.log(error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({
				errors: error.errors.map((errorDetail) => ({
					field: errorDetail.path[0],
					error: errorDetail.message,
				})),
			});
		}
	}
};
