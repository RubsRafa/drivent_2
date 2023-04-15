import { Router } from 'express';
import { getAllTickets, getMyTicket, postTicket } from '@/controllers/tickets-controller';
import { authenticateToken } from '@/middlewares';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken).get('/types', getAllTickets).get('/', getMyTicket).post('/', postTicket);

export { ticketsRouter };
