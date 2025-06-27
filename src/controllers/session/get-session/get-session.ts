/* eslint-disable no-unused-vars */
import { badRequest, serverError, ok } from "../../helpers";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { IGetSessionRepository } from "./protocols";
import { Session } from "../../../models/session";

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

      const session = await this.getSessionRepository.getSession(id);

      if (!session) {
        return badRequest("Session not found");
      }

      return ok<Session>(session);
    } catch (error) {
      return serverError();
    }
  }
}
