import { Router } from 'express';
import {
	register,
	login,
	logout,
	profile,
	editProfile,
	verifyData,
	changePassword,
	getUserFeedBack,
} from '../controllers/user.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import { authNotRequired } from '../middlewares/validate.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import {
	registerSchema,
	loginSchema,
	editProfileSchema,
	verifyUserSchema,
	resetPasswordSchema,
} from '../schemas/user.schema.js';

const router = Router();

router.post('/register', authNotRequired, validateSchema(registerSchema), register);

router.post('/login', authNotRequired, validateSchema(loginSchema), login);

router.post('/logout', authRequired, logout);

router.get('/profile/:id', authRequired, profile);

router.put('/profile', authRequired, validateSchema(editProfileSchema), editProfile);

router.post('/verify-data', authNotRequired, validateSchema(verifyUserSchema), verifyData);

router.post(
	'/change-password',
	authNotRequired,
	validateSchema(resetPasswordSchema),
	changePassword
);

router.get('/:id/feedback', authRequired, getUserFeedBack);

export default router;
