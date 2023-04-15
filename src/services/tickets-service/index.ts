import { notFoundError } from "@/errors";
import { badRequestError } from "@/errors/bad-request";
import { TicketType } from "@/protocols";
import ticketsRepository from "@/repositories/tickets-repository"

async function getAllTickets(): Promise<TicketType[]> {

    const allTickets = await ticketsRepository.getAllTickets();
    return allTickets;

}

async function getMyTicket(userId: number) {
    const [myTicket] = await ticketsRepository.getMyTicket(userId);

    if(!myTicket) {
        throw notFoundError();
    }
    return myTicket;
}

async function postTicket(ticketTypeId: number, userId:number) {

    if(!ticketTypeId) throw badRequestError();
    const enrollment = await ticketsRepository.findUserEnrollment(userId);

    if(!enrollment) throw notFoundError();

    await ticketsRepository.postTicket(ticketTypeId, enrollment.id)

    const [myPostedTicket] = await ticketsRepository.getMyTicket(userId)
    return myPostedTicket;
}


const ticketsService = {
    getAllTickets,
    getMyTicket,
    postTicket
}

export default ticketsService