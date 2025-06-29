/* eslint-disable no-unused-vars */
// src/controllers/ticket/get-ticket-by-id/GetTicketController.ts

import { badRequest, ok, serverError, notFound, unauthorized } from "../../helpers";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { IGetTicketRepository } from "./protocols";
import { Ticket } from "../../../models/ticket";
import { User, Role } from "../../../models/user";
import { ObjectId } from "mongodb";

export class GetTicketController implements IController {
  constructor(private readonly getTicketRepository: IGetTicketRepository) {}

  async handle(httpRequest: HttpRequest<any>): Promise<HttpResponse<Ticket | string>> {
    try {
      // 1. EXTRAIR O ID DO TICKET E O USUÁRIO LOGADO
      const id = httpRequest?.params?.id;
      const user = httpRequest.user as User;

      if (!user) {
        return unauthorized();
      }

      if (!id || !ObjectId.isValid(id)) {
        return badRequest("Missing or invalid ticket id");
      }

      // 2. BUSCAR O TICKET NO REPOSITÓRIO
      const ticket = await this.getTicketRepository.getTicket(id);

      // 3. VALIDAR SE O TICKET FOI ENCONTRADO
      if (!ticket) {
        // Usamos notFound para não vazar a informação de que um ticket existe.
        return notFound("Ticket not found");
      }

      // 4. APLICAR A REGRA DE PERMISSÃO
      // O usuário pode ver o ticket se:
      // a) Ele for um ADMIN
      // b) O userId do ticket for igual ao _id do usuário logado
      const isAdmin = user.role === Role.ADMIN;
      // Precisamos comparar as strings dos ObjectIds
      const isOwner = ticket.userId.toHexString() === user.id.toHexString();

      if (!isAdmin && !isOwner) {
        // Se não for admin e não for o dono, ele não tem permissão.
        // Retornamos 404 para que o usuário não saiba que o ticket de outra pessoa existe.
        return notFound("Ticket not found");
      }
      
      // 5. RETORNAR O TICKET SE A VALIDAÇÃO PASSAR
      return ok<Ticket>(ticket);

    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
