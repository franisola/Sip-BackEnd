import express from 'express';
import { Router } from 'express';

import { createContract, getContracts, getContract, updateContract } from '../controllers/contracts.controller.js'
import { authRequired } from '../middlewares/validateToken.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { createContractSchema, updateContractSchema } from '../schemas/contract.schema.js';
import { roleClient, rolePetSitter } from '../middlewares/validateRoleUser.middleware.js';

const router = Router();


router.post('/:id_service/contracts', authRequired, roleClient, validateSchema(createContractSchema), createContract);

//router.post('/:id_service/contracts', validateSchema(a));

router.get('/contracts', authRequired, rolePetSitter, getContracts);
router.get('/contracts/:id', authRequired, rolePetSitter, getContract); 
router.put('/contracts/:id', authRequired, rolePetSitter, validateSchema(updateContractSchema), updateContract);   



export default router;