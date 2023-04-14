import { prisma } from "@/config";

async function getAllTickets() {
    return prisma.ticketType.findMany()
}

const ticketsRepository = {
    getAllTickets
}

export default ticketsRepository