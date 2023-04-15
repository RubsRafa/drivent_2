import { notFoundError, unauthorizedError } from "@/errors";
import { badRequestError } from "@/errors/bad-request";
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

const paymentsService = {
    getPayment
}

export default paymentsService;