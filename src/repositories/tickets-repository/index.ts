import { prisma } from "@/config";
import { TicketType } from "@/protocols";

async function getAllTickets(): Promise<TicketType[]> {
    return prisma.ticketType.findMany()
}

const ticketsRepository = {
    getAllTickets
}

export default ticketsRepository