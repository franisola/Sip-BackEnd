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

router.post('/services', validateSchema(createServiceSchema), createService);
//router.post('/services', createService);

router.get('/random-services', getRandomServices);

router.get('/:idUser/services', getServices);

router.get('/services/:id', getService);

router.put('/services/:id', validateSchema(updateServiceSchema), updateService);

router.delete('/services/:id', deleteService);


router.get('/services', getServiceQuery);


// router.get('/associated-services', authRequired, getAssociatedServices);



export default router;
