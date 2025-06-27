/* eslint-disable no-unused-vars */
import { Session } from "../../../models/session";
import { badRequest, created, serverError } from "../../helpers";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { CreateSessionParams, ICreateSessionRepository } from "./protocols";

export class CreateSessionController implements IController {
  constructor(private readonly createSessionRepository: ICreateSessionRepository) {}

  async handle(
    httpRequest: HttpRequest<CreateSessionParams>
  ): Promise<HttpResponse<Session | string>> {
    try {
      const { movie_id, room_id, starts_at, ends_at, duration_min, base_price } =
        httpRequest.body!;

      if (!movie_id || !room_id || !starts_at || !ends_at || !duration_min || !base_price) {
        return badRequest("All fields are required.");
      }

      const sessionDataToCreate: CreateSessionParams = {
        movie_id,
        room_id,
        starts_at,
        ends_at,
        duration_min,
        base_price,
      };

      const session = await this.createSessionRepository.createSession(sessionDataToCreate);

      return created<Session>(session);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}