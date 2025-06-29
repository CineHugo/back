/* eslint-disable no-unused-vars */
import { Room } from "../../../models/room";
import { badRequest, ok, serverError } from "../../helpers";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { IDeleteRoomRepository } from "./protocols";

export class DeleteRoomController implements IController {
  constructor(
    private readonly deleteRoomRepository: IDeleteRoomRepository
  ) {}

  async handle(
    httpRequest: HttpRequest<any>
  ): Promise<HttpResponse<Room | string>> {
    try {
      const id = httpRequest?.params?.id;

      if (!id) {
        return badRequest("Missing room id");
      }

      await this.deleteRoomRepository.deleteRoom(id);

      return ok<Room>(null);
    } catch (error) {
      return serverError();
    }
  }
}