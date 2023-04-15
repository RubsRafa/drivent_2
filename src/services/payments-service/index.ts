import { notFoundError, unauthorizedError } from "@/errors";
import { badRequestError } from "@/errors/bad-request";
import { PaymentType } from "@/protocols";
import paymentsRepository from "@/repositories/payments-repository";

async function getPayment (ticketId: string | number, userId: number) {
    const newTicketId = Number(ticketId)
    if (!ticketId) throw badRequestError();
    const ticketExist = await paymentsRepository.findTicket(newTicketId);

    if(!ticketExist) throw notFoundError();
    
    const findEnrollment = await paymentsRepository.findEnrollment(ticketExist.enrollmentId);
    if(!findEnrollment) throw notFoundError();
    if(findEnrollment.userId !== userId) throw unauthorizedError();

    const getPayment = await paymentsRepository.getPayment(newTicketId);

    if(!getPayment) throw notFoundError();

    return getPayment
}

async function postPayment(pay: PaymentType, userId: number){
    if(!pay || !pay.cardData || !pay.ticketId) throw badRequestError();

    const ticketExist = await paymentsRepository.findTicket(pay.ticketId);
    if(!ticketExist) throw notFoundError();

    const findEnrollment = await paymentsRepository.findEnrollment(ticketExist.enrollmentId);
    if(!findEnrollment) throw notFoundError();
    if(findEnrollment.userId !== userId) throw unauthorizedError();

    const findTicketType = await paymentsRepository.findTicketType(ticketExist.ticketTypeId);
    if(!findTicketType) throw notFoundError();

    const payed = await paymentsRepository.postPayment(pay, findTicketType.price);
    await paymentsRepository.updateTicket(ticketExist.id);

    return payed;
}

const paymentsService = {
    getPayment,
    postPayment
}

export default paymentsService;