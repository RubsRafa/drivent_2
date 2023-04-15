import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import ticketsService from "@/services/tickets-service";

export async function getAllTickets(req: AuthenticatedRequest, res: Response) {

    try {

        const allTickets = await ticketsService.getAllTickets();
        return res.status(httpStatus.OK).send(allTickets)
        
    } catch (err) {
        console.log(err);
        return res.sendStatus(httpStatus.NO_CONTENT)
    }
}

export async function getMyTicket(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;

    try {
        const myTicket = await ticketsService.getMyTicket(userId);
        return res.status(httpStatus.OK).send(myTicket)
        
    } catch (err) {
        console.log(err);
        return res.sendStatus(httpStatus.NOT_FOUND)
    }
}

export async function postTicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { ticketTypeId } = req.body;
    const { userId } = req;

    try {
        const myPostedTicket = await ticketsService.postTicket(ticketTypeId, userId);
        return res.status(httpStatus.CREATED).send(myPostedTicket)

        
    } catch (err) {
        console.log(err);
        // return res.sendStatus(httpStatus.BAD_REQUEST)
        next(err);
    }
}