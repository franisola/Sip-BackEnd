import { Router } from 'express';

import { getContracts, getContract, updateContract } from '../controllers/contracts.controller.js'
import { authRequired } from '../middlewares/validateToken.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { createContractSchema, updateContractSchema } from '../schemas/contract.schema.js';


const router = Router();


// router.post('/:id_service/contracts', authRequired, validateSchema(createContractSchema), createContract);


router.get('/contracts', authRequired, getContracts);
router.get('/contracts/:id', authRequired, getContract); 
router.put('/contracts/:id', authRequired, validateSchema(updateContractSchema), updateContract);   


// router.post('/:id_service/contracts', validateSchema(a));

export default router;