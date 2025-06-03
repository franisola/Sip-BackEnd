import express from 'express';
import { createPreference, paymentWebhook } from '../controllers/payment.controller.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = express.Router();

router.post('/create-preference', createPreference);
router.get('/webhook', paymentWebhook);
router.post('/webhook', paymentWebhook);

export default router;



