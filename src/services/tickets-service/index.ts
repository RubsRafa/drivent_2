import { TicketType } from "@/protocols";
import ticketsRepository from "@/repositories/tickets-repository"

async function getAllTickets(): Promise<TicketType[]> {

    const allTickets = await ticketsRepository.getAllTickets();
    return allTickets;

}



const ticketsService = {
    getAllTickets
}

export default ticketsService