import { Router } from 'express';
import {
	createService,
	getServices,
	getService,
	updateService,
	deleteService,
	getServiceQuery,
	// getAssociatedServices

} from '../controllers/service.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import { roleClient, rolePetSitter } from '../middlewares/validateRoleUser.middleware.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { createServiceSchema, updateServiceSchema } from '../schemas/service.schema.js';
const router = Router();

router.post('/services', authRequired, rolePetSitter, validateSchema(createServiceSchema), createService);
//router.post('/services', createService);

router.get('/:idUser/services', authRequired, getServices);
router.get('/services/:id', authRequired, getService);
router.put('/services/:id', authRequired, rolePetSitter, validateSchema(updateServiceSchema), updateService);
router.put('/services/:id/delete', authRequired, rolePetSitter, deleteService);


router.get('/services', authRequired, getServiceQuery);


// router.get('/associated-services', authRequired, getAssociatedServices);



export default router;
