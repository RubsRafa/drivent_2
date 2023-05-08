import { jest } from '@jest/globals';
import { TicketStatus } from '@prisma/client';
import {
  returnCardData,
  returnEnrollment,
  returnPayment,
  returnTicketWithEnrollment,
  returnTicketWithType,
} from '../factories';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentsService from '@/services/payments-service';
import paymentsRepository from '@/repositories/payments-repository';

describe('paymentsService test suite', () => {
  describe('verifyTicketAndEnrollment', () => {
    it('should verify ticket and enrollment', async () => {
      const enrollment = returnEnrollment();
      jest.spyOn(ticketsRepository, 'findTickeyById').mockImplementationOnce((): any => {
        return returnTicketWithEnrollment();
      });
      jest.spyOn(enrollmentRepository, 'findById').mockImplementationOnce((): any => {
        return enrollment;
      });

      await paymentsService.verifyTicketAndEnrollment(1, enrollment.userId);
      expect(ticketsRepository.findTickeyById).toBeCalled();
      expect(enrollmentRepository.findById).toBeCalled();
    });
    it('should not verify if ticket does not exist', async () => {
      jest.spyOn(ticketsRepository, 'findTickeyById').mockImplementationOnce((): any => {
        return undefined;
      });

      const response = paymentsService.verifyTicketAndEnrollment(1, 1);
      expect(response).rejects.toStrictEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });
    it('should not verify if enrollment does not exist', async () => {
      jest.spyOn(ticketsRepository, 'findTickeyById').mockImplementationOnce((): any => {
        return returnTicketWithEnrollment();
      });
      jest.spyOn(enrollmentRepository, 'findById').mockImplementationOnce((): any => {
        return undefined;
      });

      const response = paymentsService.verifyTicketAndEnrollment(1, 1);
      expect(response).rejects.toStrictEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });
    it('should not verify if enrollment is not from user', async () => {
      const enrollment = returnEnrollment();
      jest.spyOn(ticketsRepository, 'findTickeyById').mockImplementationOnce((): any => {
        return returnTicketWithEnrollment();
      });
      jest.spyOn(enrollmentRepository, 'findById').mockImplementationOnce((): any => {
        return enrollment;
      });
      const response = paymentsService.verifyTicketAndEnrollment(1, 0);
      expect(response).rejects.toStrictEqual({
        name: 'UnauthorizedError',
        message: 'You must be signed in to continue',
      });
    });
  });
  describe('getPaymentByTicketId', () => {
    it('should get payment by ticket id', async () => {
      const enrollment = returnEnrollment();
      const payment = returnPayment();

      jest.spyOn(ticketsRepository, 'findTickeyById').mockImplementationOnce((): any => {
        return returnTicketWithEnrollment();
      });
      jest.spyOn(enrollmentRepository, 'findById').mockImplementationOnce((): any => {
        return enrollment;
      });
      jest.spyOn(paymentsRepository, 'findPaymentByTicketId').mockImplementationOnce((): any => {
        return payment;
      });

      const response = await paymentsService.getPaymentByTicketId(enrollment.userId, 1);
      expect(response).toBe(payment);
    });
    it('should not get payment if payment does not exist', async () => {
      const enrollment = returnEnrollment();

      jest.spyOn(ticketsRepository, 'findTickeyById').mockImplementationOnce((): any => {
        return returnTicketWithEnrollment();
      });
      jest.spyOn(enrollmentRepository, 'findById').mockImplementationOnce((): any => {
        return enrollment;
      });
      jest.spyOn(paymentsRepository, 'findPaymentByTicketId').mockImplementationOnce((): any => {
        return undefined;
      });

      const response = paymentsService.getPaymentByTicketId(enrollment.userId, 1);
      expect(response).rejects.toStrictEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });
  });
  describe('paymentProcess', () => {
    it('should pay', async () => {
      const enrollment = returnEnrollment();
      const payment = returnPayment();
      const cardData = returnCardData();
      jest.spyOn(ticketsRepository, 'findTickeyById').mockImplementationOnce((): any => {
        return returnTicketWithEnrollment();
      });
      jest.spyOn(enrollmentRepository, 'findById').mockImplementationOnce((): any => {
        return enrollment;
      });
      jest.spyOn(ticketsRepository, 'findTickeWithTypeById').mockImplementationOnce((): any => {
        return returnTicketWithType(false, true, TicketStatus.PAID);
      });
      jest.spyOn(paymentsRepository, 'createPayment').mockImplementationOnce((): any => {
        return payment;
      });
      jest.spyOn(ticketsRepository, 'ticketProcessPayment').mockImplementationOnce((): any => {
        return;
      });

      const response = await paymentsService.paymentProcess(1, enrollment.userId, cardData);
      expect(response).toBe(payment);
    });
  });
});
