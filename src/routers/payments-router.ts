import { Router } from 'express';
import { getPayment, postPayment } from '@/controllers/payments-controller';
import { authenticateToken } from '@/middlewares';

const paymentsRouter = Router();

paymentsRouter.all('/*', authenticateToken).get('/', getPayment).post('/process', postPayment);

export { paymentsRouter };
