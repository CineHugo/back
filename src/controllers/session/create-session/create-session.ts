/* eslint-disable no-unused-vars */
import { Session } from "../../../models/session";
import { badRequest, created, serverError } from "../../helpers";
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
      console.error(error);
      return serverError();
    }
  }
}
