/* eslint-disable no-unused-vars */
// src/controllers/ticket/get-tickets/GetTicketsController.ts

import { ok, serverError, unauthorized } from "../../helpers";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { GetTicketsFilters, IGetTicketsRepository } from "./protocols";
import { User, Role } from "../../../models/user"; // Importe seus modelos
import { ObjectId } from "mongodb";
import { Ticket } from "../../../models/ticket";

export class GetTicketsController implements IController {
  constructor(private readonly ticketsRepository: IGetTicketsRepository) {}

  async handle(httpRequest: HttpRequest<any>): Promise<HttpResponse<Ticket[] | string>> {
    try {
      // 1. EXTRAIR DADOS DA REQUISIÇÃO
      // Assumimos que um middleware de autenticação já validou o token
      // e anexou o objeto 'user' à requisição.
      const user = httpRequest.user as User;
      const { sessionId, status, userId: userIdFromQuery } = httpRequest.query || {};

      if (!user) {
        return unauthorized();
      }

      // 2. CONSTRUIR OS FILTROS COM BASE NA ROLE
      const filters: GetTicketsFilters = {};

      if (user.role === Role.ADMIN) {
        // ADMIN: Pode filtrar por qualquer usuário se `userId` for passado na query.
        if (userIdFromQuery) {
          filters.userId = new ObjectId(userIdFromQuery);
        }
      } else {
        // USER: SÓ PODE VER SEUS PRÓPRIOS TICKETS. Esta regra é forçada.
        filters.userId = user._id; // Use _id, conforme nossas convenções
      }

      // 3. APLICAR FILTROS ADICIONAIS (disponíveis para ambos os papéis)
      if (sessionId) {
        filters.sessionId = new ObjectId(sessionId);
      }
      if (status && ['ACTIVE', 'USED', 'CANCELLED'].includes(status.toUpperCase())) {
        filters.status = status.toUpperCase() as GetTicketsFilters['status'];
      }

      // 4. CHAMAR O REPOSITÓRIO COM OS FILTROS DEFINIDOS
      const tickets = await this.ticketsRepository.getTickets(filters);

      return ok<Ticket[]>(tickets);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
