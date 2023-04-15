import { prisma } from "@/config";
import { TicketType } from "@/protocols";

async function getAllTickets(): Promise<TicketType[]> {
    return prisma.ticketType.findMany()
}

async function getMyTicket(userId: number) {
    return prisma.ticket.findMany({
        where: {
            Enrollment: {
                userId
            }
        },
        select : {
            id: true,
            status: true,
            ticketTypeId: true,
            enrollmentId: true,
            TicketType: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                    isRemote: true,
                    includesHotel: true,
                    createdAt: true,
                    updatedAt: true
                }
            },
            createdAt: true,
            updatedAt: true
        }
    })
}

const ticketsRepository = {
    getAllTickets,
    getMyTicket
}

export default ticketsRepository