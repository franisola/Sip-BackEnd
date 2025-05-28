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
router.get('/services/search', getServiceQuery);

router.get('/services/random', getRandomServices);

router.get('/users/:idUser/services', getServices);


router.get('/services/:id', getService);
router.put('/services/:id', validateSchema(updateServiceSchema), updateService);
router.delete('/services/:id', deleteService);










export default router;
