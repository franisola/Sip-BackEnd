import express from 'express';
import { createPreference, paymentWebhook } from '../controllers/payment.controller.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = express.Router();

router.post('/create-preference', authRequired, createPreference);
router.post('/webhook', authRequired, paymentWebhook);

export default router;
