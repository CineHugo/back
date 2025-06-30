/* eslint-disable no-unused-vars */
// src/controllers/ticket/update-ticket-status/UpdateTicketStatusController.ts

import { badRequest, notFound, ok, serverError, unauthorized, forbidden } from "../../helpers";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { IGetTicketRepository } from "../get-ticket/protocols";
import { IUpdateTicketRepository } from "./protocols";
import { User, Role } from "../../../models/user";
import { Ticket, Status } from "../../../models/ticket"; // Importando o enum Status
import { ObjectId } from "mongodb";

export class UpdateTicketStatusController implements IController {
  
  // O controller é configurado com os status de origem e destino permitidos, usando o enum
  constructor(
    private readonly getTicketRepository: IGetTicketRepository,
    private readonly updateTicketRepository: IUpdateTicketRepository,
    private readonly allowedInitialStatus: Status,
    private readonly targetStatus: Status
  ) {}

  async handle(httpRequest: HttpRequest<any>): Promise<HttpResponse<any>> {
    try {
      const id = httpRequest?.params?.id;
      const user = httpRequest.user as User;

      if (!user) return unauthorized();
      if (!id || !ObjectId.isValid(id)) return badRequest("Missing or invalid ticket id");

      const ticket = await this.getTicketRepository.getTicket(id);
      if (!ticket) return notFound("Ticket not found");

      const isAdmin = user.role === Role.ADMIN;
      const isOwner = ticket.user?._id?.toHexString() === user._id.toHexString();

      if (this.targetStatus === Status.CANCELLED && !isOwner && !isAdmin) {
        return forbidden("You do not have permission to cancel this ticket.");
      }
      if (this.targetStatus === Status.USED && !isAdmin) {
        return forbidden("Only administrators can mark a ticket as used.");
      }
      
      if (ticket.status !== this.allowedInitialStatus) {
        return badRequest(`Ticket is not in a valid state for this operation. Current status: ${ticket.status}`);
      }

      const updatedTicket = await this.updateTicketRepository.updateTicketStatus(id, this.targetStatus);

      return ok(updatedTicket);

    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
