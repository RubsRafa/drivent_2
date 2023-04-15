import { prisma } from '@/config';
import { PaymentType } from '@/protocols';

async function findTicket(ticketId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
  });
}

async function findEnrollment(enrollmentId: number) {
  return prisma.enrollment.findFirst({
    where: {
      id: enrollmentId,
    },
  });
}

async function findTicketType(id: number) {
  return prisma.ticketType.findFirst({
    where: {
      id,
    },
  });
}

async function getPayment(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

async function postPayment(pay: PaymentType, price: number) {
  const cardDigits = `${pay.cardData.number}`;
  const cardLastDigits = cardDigits.slice(cardDigits.length - 4);

  return prisma.payment.create({
    data: {
      ticketId: pay.ticketId,
      value: price,
      cardIssuer: pay.cardData.issuer,
      cardLastDigits: cardLastDigits,
    },
  });
}

async function updateTicket(id: number) {
  return prisma.ticket.update({
    where: {
      id,
    },
    data: {
      status: 'PAID',
    },
  });
}

const paymentsRepository = {
  findTicket,
  findEnrollment,
  getPayment,
  postPayment,
  findTicketType,
  updateTicket,
};

export default paymentsRepository;
