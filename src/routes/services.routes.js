import { Router } from 'express';
import {
	createService,
	getServices,
	getService,
	updateService,
	deleteService,
	getServiceQuery,
	getRandomServices
	// getAssociatedServices

} from '../controllers/service.controller.js';
import { authRequired } from '../middlewares/validateToken.js';

import { validateSchema } from '../middlewares/validator.middleware.js';
import { createServiceSchema, updateServiceSchema } from '../schemas/service.schema.js';
const router = Router();

router.post('/services', authRequired, validateSchema(createServiceSchema), createService);
//router.post('/services', createService);

router.get('/random-services', authRequired, getRandomServices);

router.get('/:idUser/services', authRequired, getServices);

router.get('/services/:id', authRequired, getService);

router.put('/services/:id', authRequired, validateSchema(updateServiceSchema), updateService);

router.delete('/services/:id', authRequired, deleteService);


router.get('/services', authRequired, getServiceQuery);


// router.get('/associated-services', authRequired, getAssociatedServices);



export default router;
