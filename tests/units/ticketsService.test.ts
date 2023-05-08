import { jest } from '@jest/globals';
import { TicketStatus } from '@prisma/client';
import { returnEnrollmentWithAddress, returnTicketType, returnTicketWithType } from '../factories';
import ticketsRepository from '@/repositories/tickets-repository';
import ticketService from '@/services/tickets-service';
import enrollmentRepository from '@/repositories/enrollment-repository';

describe('ticketsService test suite', () => {
  describe('getTicketType', () => {
    it('should get ticket type', async () => {
      const ticketTypes = returnTicketType();
      jest.spyOn(ticketsRepository, 'findTicketTypes').mockImplementationOnce((): any => {
        return ticketTypes;
      });

      const response = await ticketService.getTicketType();
      expect(response).toBe(ticketTypes);
    });
    it('should not get ticket type if ticket type does not exist', async () => {
      jest.spyOn(ticketsRepository, 'findTicketTypes').mockImplementationOnce((): any => {
        return undefined;
      });

      const response = ticketService.getTicketType();
      expect(response).rejects.toStrictEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });
  });
  describe('getTicketByUserId', () => {
    it('should get ticket by user id', async () => {
      const ticket = returnTicketWithType(false, true, TicketStatus.PAID);
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return returnEnrollmentWithAddress();
      });
      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return ticket;
      });

      const response = await ticketService.getTicketByUserId(1);
      expect(response).toBe(ticket);
    });
    it('should not get ticket if enrollment does not exist', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return undefined;
      });

      const response = ticketService.getTicketByUserId(1);
      expect(response).rejects.toStrictEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });
    it('should not get ticket if ticket does not exist', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return returnEnrollmentWithAddress();
      });
      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return undefined;
      });

      const response = ticketService.getTicketByUserId(1);
      expect(response).rejects.toStrictEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });
  });
  describe('createTicket', () => {
    it('should create ticket', async () => {
      const ticket = returnTicketWithType(false, true, TicketStatus.PAID);
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return returnEnrollmentWithAddress();
      });
      jest.spyOn(ticketsRepository, 'createTicket').mockImplementationOnce((): any => {
        return;
      });
      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return ticket;
      });

      const response = await ticketService.createTicket(1, 1);
      expect(response).toBe(ticket);
    });
    it('should not create ticket if enrollment does not exist', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return undefined;
      });

      const response = ticketService.createTicket(1, 1);
      expect(response).rejects.toStrictEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });
  });
});
