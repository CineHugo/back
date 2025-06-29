/* eslint-disable no-unused-vars */
import { badRequest, serverError, ok } from "../../helpers";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { IGetSessionRepository } from "./protocols";
import { Session } from "../../../models/session";
import { ObjectId } from "mongodb";

export class GetSessionController implements IController {
  constructor(private readonly getSessionRepository: IGetSessionRepository) {}
  async handle(
    httpRequest: HttpRequest<unknown>
  ): Promise<HttpResponse<unknown>> {
    try {
      const id = httpRequest?.params?.id;

      if (!id) {
        return badRequest("Missing session id");
      }

      // ---> ADICIONE ESTA VALIDAÇÃO <---
      if (!ObjectId.isValid(id)) {
        return badRequest("Invalid session id format");
      }

      const session = await this.getSessionRepository.getSession(id);

      if (!session) {
        // Agora, se cair aqui, você tem mais certeza de que o problema
        // é uma referência quebrada (roomId) ou o ID realmente não existe.
        return badRequest("Session not found");
      }

      return ok<Session>(session);
    } catch (error) {
      return serverError();
    }
  }
}
