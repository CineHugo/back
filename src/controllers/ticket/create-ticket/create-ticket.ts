/* eslint-disable no-unused-vars */
import { Ticket } from "../../../models/ticket";
import { badRequest, conflict, created, serverError } from "../../helpers";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { CreateTicketParams, ICreateTicketRepository } from "./protocols";

export class CreateTicketController implements IController {
  constructor(
    private readonly createTicketRepository: ICreateTicketRepository
  ) {}

  async handle(
    httpRequest: HttpRequest<CreateTicketParams>
  ): Promise<HttpResponse<Ticket | string>> {
    try {
      const {
        sessionId,
        userId,
        seatLabel,
        occupantName,
        occupantEmail,
        occupantCpf,
      } = httpRequest.body!;

      if (
        !sessionId ||
        !userId ||
        !seatLabel ||
        !occupantName ||
        !occupantEmail ||
        !occupantCpf
      ) {
        return badRequest("All fields are required.");
      }

      const ticketDataToCreate: CreateTicketParams = {
        sessionId,
        userId,
        seatLabel,
        occupantName,
        occupantEmail,
        occupantCpf,
      };

      const ticket =
        await this.createTicketRepository.createTicket(ticketDataToCreate);

      if (!ticket) {
        return badRequest("Failed to create ticket.");
      }

      return created<Ticket>(ticket);
      } catch (error: any) {
        // O MongoDB lança um erro com código 11000 para violações de índice único.
        if (error && error.code === 11000) {
          // Retorna o status 409 Conflict com uma mensagem amigável
          return conflict("Um ou mais assentos selecionados já estão ocupados. Por favor, tente novamente.");
        }

        // Para qualquer outro erro, retorna um erro de servidor genérico
        console.error("Error creating ticket:", error);
        return serverError();
      }
  }
}
