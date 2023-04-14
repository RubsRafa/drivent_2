import ticketsRepository from "@/repositories/tickets-repository"

async function getAllTickets() {

    const allTickets = await ticketsRepository.getAllTickets();
    return allTickets;

}



const ticketsService = {
    getAllTickets
}

export default ticketsService