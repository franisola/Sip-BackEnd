/**
 * User routes for authentication, profile management, and feedback.
 *
 * @module routes/users
 * @requires express.Router
 * @requires ../controllers/user.controller
 * @requires ../middlewares/validateToken
 * @requires ../middlewares/validate
 * @requires ../middlewares/validator.middleware
 * @requires ../schemas/user.schema
 *
 * Routes:
 * - POST /register: Register a new user. Requires no authentication.
 * - POST /login: Log in a user. Requires no authentication.
 * - POST /logout: Log out the authenticated user.
 * - GET /profile/:id: Get the profile of a user by ID. Requires authentication.
 * - PUT /profile: Edit the authenticated user's profile.
 * - POST /verify-data: Verify user data (e.g., for registration or password reset).
 * - POST /change-password: Change or reset a user's password.
 * - GET /:id/feedback: Get feedback for a user by ID. Requires authentication.
 */
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
