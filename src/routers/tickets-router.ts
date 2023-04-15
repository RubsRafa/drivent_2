import { getAllTickets, getMyTicket } from "@/controllers/tickets-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from 'express';

const ticketsRouter = Router();

ticketsRouter
    .all('/*', authenticateToken)
    .get('/types', getAllTickets)
    .get('/', getMyTicket)


export { ticketsRouter };