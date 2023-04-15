import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService from '@/services/payments-service';
import { PaymentType, TicketId } from '@/protocols';

export async function getPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { ticketId } = req.query as TicketId;
  const { userId } = req;

  try {
    const myPayment = await paymentsService.getPayment(ticketId, userId);

    return res.status(httpStatus.OK).send(myPayment);
  } catch (err) {
    next(err);
  }
}

export async function postPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const pay = req.body as PaymentType;
  const { userId } = req;

  try {
    const payment = await paymentsService.postPayment(pay, userId);
    return res.status(httpStatus.OK).send(payment);
  } catch (err) {
    next(err);
  }
}
