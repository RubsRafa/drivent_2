import { prisma } from "@/config";

async function findTicket(ticketId: number) {
    //findFirst funcionou, findUnique não; ticketId não é unico?
    return prisma.ticket.findFirst({
        where: {
            id: ticketId
        }
    })
}

async function findEnrollment(enrollmentId: number) {
    return prisma.enrollment.findFirst({
        where: {
            id: enrollmentId
        }
    })   
}

async function getPayment(ticketId: number) {
    return prisma.payment.findFirst({
        where: {
            ticketId
        }
    })
}

const paymentsRepository = {
    findTicket,
    findEnrollment,
    getPayment
}

export default paymentsRepository