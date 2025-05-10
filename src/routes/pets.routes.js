import { Router } from 'express';
import { createPet, getPets, getPet, deletePet } from '../controllers/pet.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { petSchema } from '../schemas/pet.schema.js';
import { roleClient } from '../middlewares/validateRoleUser.middleware.js';

const router = Router();

router.post('/pets', authRequired, roleClient, validateSchema(petSchema), createPet);

//router.post('/pets',  createPet);

router.get('/pets', authRequired, getPets);

router.get('/pets/:id', authRequired, getPet);

// router.delete('/pets/:id', authRequired, roleClient, deletePet);
router.delete('/pets/:id', deletePet);

export default router;
