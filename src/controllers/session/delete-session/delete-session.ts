/* eslint-disable no-unused-vars */
import { Session } from "../../../models/session";
import { badRequest, ok, serverError } from "../../helpers";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { IDeleteSessionRepository } from "./protocols";

export class DeleteSessionController implements IController {
  constructor(
    private readonly deleteSessionRepository: IDeleteSessionRepository
  ) {}
  async handle(
    httpRequest: HttpRequest<any>
  ): Promise<HttpResponse<Session | string>> {
    try {
      const id = httpRequest?.params?.id;

      if (!id) {
        return badRequest("Missing session id");
      }

      await this.deleteSessionRepository.deleteSession(id);

      return ok<Session>(null);
    } catch (error) {
      return serverError();
    }
  }
}
