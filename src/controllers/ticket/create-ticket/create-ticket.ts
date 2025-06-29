/* eslint-disable no-unused-vars */
// src/controllers/ticket/create-ticket/CreateTicketController.ts

import { badRequest, created, serverError, conflict, unauthorized } from "../../helpers";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { CreateTicketParams, ICreateTicketRepository } from "./protocols";
import { Ticket } from "../../../models/ticket";
import { User } from "../../../models/user";
import { MongoClient } from "../../../database/mongo"; // Importe o MongoClient
import { ObjectId } from "mongodb";

// Interface para o corpo da requisição de reserva
interface ReserveTicketsBody {
  sessionId: ObjectId; // ID da sessão
  seats: Array<{
    occupantEmail: string;
    label: string;
    occupantName: string;
    occupantCpf: string;
  }>;
}

export class CreateTicketController implements IController {
  constructor(private readonly createTicketRepository: ICreateTicketRepository) {}

  async handle(httpRequest: HttpRequest<ReserveTicketsBody>): Promise<HttpResponse<Ticket[] | string>> {
    
    // Inicia a sessão da transação a partir do cliente conectado
    const transactionSession = MongoClient.client.startSession();
    
    try {
      const user = httpRequest.user as User;
      const { sessionId, seats } = httpRequest.body!;

      if (!user) {
        return unauthorized();
      }
      if (!sessionId || !seats || !Array.isArray(seats) || seats.length === 0) {
        return badRequest("Fields sessionId and a non-empty array of seats are required.");
      }
      
      let createdTickets: Ticket[] = [];

      // `withTransaction` é a forma mais segura de executar transações.
      // Ele trata o commit e o abort automaticamente.
      await transactionSession.withTransaction(async () => {
        // Mapeia os dados da requisição para o formato que o repositório espera
        const ticketCreationPromises = seats.map(seat => {
          const params: CreateTicketParams = {
            sessionId: sessionId,
            userId: user.id,
            seatLabel: seat.label,
            occupantName: seat.occupantName,
            occupantCpf: seat.occupantCpf,
            occupantEmail: seat.occupantEmail || "", // Adiciona email se disponível
          };
          
          // Chama o repositório para cada bilhete
          return this.createTicketRepository.createTicket(params, { session: transactionSession });
        });
        
        // Executa todas as promessas de criação de bilhetes
        createdTickets = await Promise.all(ticketCreationPromises);
      });
      return created<Ticket[]>(createdTickets);

    } catch (error: any) {
      // Se o erro for de duplicidade (assento já ocupado)
      if (error.code === 11000) {
        return conflict("Um ou mais assentos selecionados já estão ocupados.");
      }
      
      return serverError();
    } finally {
      await transactionSession.endSession();
    }
  }
}
