/* eslint-disable no-unused-vars */
import { Session } from "../../../models/session";
import { badRequest, ok, serverError } from "../../helpers";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { IUpdateSessionRepository, UpdateSessionParams } from "./protocols";

export class UpdateSessionController implements IController {
  constructor(
    private readonly updateSessionRepository: IUpdateSessionRepository
  ) {}

  async handle(
    httpRequest: HttpRequest<UpdateSessionParams>
  ): Promise<HttpResponse<Session | string>> {
    try {
      const id = httpRequest?.params?.id;
      const body = httpRequest?.body;

      if (!body) {
        return badRequest("Body missing fields");
      }

      if (!id) {
        return badRequest("Missing session id");
      }

      const allowedFieldsToUpdate: (keyof UpdateSessionParams)[] = [
        "movie_id",
        "room_id",
        "starts_at",
        "ends_at",
        "duration_min",
        "base_price",
      ];

      const someFieldsAreNotAllowedToUpdate = Object.keys(body).some(
        (key) =>
          !allowedFieldsToUpdate.includes(key as keyof UpdateSessionParams)
      );

      if (someFieldsAreNotAllowedToUpdate) {
        return badRequest("Some fields are not allowed to be updated");
      }

      const session = await this.updateSessionRepository.updateSession(
        id,
        body
      );

      if (!session) {
        return badRequest("Session not found or no fields to update");
      }

      return ok<Session>(session);
    } catch (error) {
      return serverError();
    }
  }
}
