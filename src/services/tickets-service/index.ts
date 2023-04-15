import { notFoundError } from "@/errors";
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


const ticketsService = {
    getAllTickets,
    getMyTicket
}

export default ticketsService