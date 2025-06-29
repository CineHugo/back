/* eslint-disable no-unused-vars */
import { Session } from "../../../models/session";
import { badRequest, conflict, created, serverError } from "../../helpers";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { CreateSessionParams, ICreateSessionRepository } from "./protocols";

export class CreateSessionController implements IController {
  constructor(
    private readonly createSessionRepository: ICreateSessionRepository
  ) {}

  async handle(
    httpRequest: HttpRequest<CreateSessionParams>
  ): Promise<HttpResponse<Session | string>> {
    try {
      const { movieId, roomId, startsAt, durationMin, basePrice } =
        httpRequest.body!;

      if (!movieId || !roomId || !startsAt || !durationMin || !basePrice) {
        return badRequest("All fields are required.");
      }

      const sessionDataToCreate: CreateSessionParams = {
        movieId,
        roomId,
        startsAt,
        durationMin,
        basePrice,
      };

      const session =
        await this.createSessionRepository.createSession(sessionDataToCreate);

      return created<Session>(session);
    } catch (error) {
      // AQUI ESTÁ A LÓGICA DE TRATAMENTO DE ERRO
      
      // Verifica se o erro é uma instância de Error e se a mensagem
      // começa com "Conflict:", como definimos no repositório.
      if (error instanceof Error && error.message.startsWith('Conflict:')) {
        // Se for o nosso erro de conflito, retorna 409 com a mensagem específica.
        return conflict(error.message);
      }
      
      // Para todos os outros erros, loga e retorna um erro de servidor genérico.
      console.error("Unexpected error creating session:", error);
      return serverError();
    }
  }
}
