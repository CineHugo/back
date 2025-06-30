/* eslint-disable no-unused-vars */
// src/controllers/ticket/get-ticket-by-id/GetTicketController.ts

import { badRequest, ok, serverError, notFound, unauthorized } from "../../helpers";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { IGetTicketRepository } from "./protocols";
import { PopulatedTicket } from "../../../models/ticket"; // Use PopulatedTicket
import { User, Role } from "../../../models/user";
import { ObjectId } from "mongodb";

export class GetTicketController implements IController {
  constructor(private readonly getTicketRepository: IGetTicketRepository) {}

  async handle(httpRequest: HttpRequest<any>): Promise<HttpResponse<PopulatedTicket | string>> {
    try {
      const id = httpRequest?.params?.id;
      const user = httpRequest.user as User;

      if (!user) return unauthorized();
      if (!id || !ObjectId.isValid(id)) return badRequest("Missing or invalid ticket id");

      const ticket = await this.getTicketRepository.getTicket(id);

      if (!ticket) return notFound("Ticket not found");

      const isAdmin = user.role === Role.ADMIN;
      
      // A VERIFICAÇÃO FINAL E CORRETA
      // Compara o _id do utilizador aninhado com o _id do utilizador logado
      const isOwner = ticket.user?._id?.toHexString() === user._id.toHexString();

      if (!isAdmin && !isOwner) {
        return notFound("Ticket not found or permission denied");
      }
      
      return ok<PopulatedTicket>(ticket);
    } catch (error) {
      console.error("Error in GetTicketController:", error);
      return serverError();
    }
  }
}
