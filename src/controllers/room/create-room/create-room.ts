/* eslint-disable no-unused-vars */
import { badRequest, created, serverError } from "../../helpers";
import { Room } from "../../../models/room";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { CreateRoomParams, ICreateRoomRepository } from "./protocols";

export class CreateRoomController implements IController {
  constructor(private readonly createRoomRepository: ICreateRoomRepository) {}
  async handle(
    httpRequest: HttpRequest<CreateRoomParams>
  ): Promise<HttpResponse<Room | string>> {
    try {
      const { name, seatMap } = httpRequest.body!;

      if (!name || seatMap == null || !Array.isArray(seatMap) || seatMap.length === 0) {
        return badRequest("Name and seat map are required.");
      }

      const roomDataToCreate: CreateRoomParams = {
        name,
        seatMap,
      };

      const room = await this.createRoomRepository.createRoom(roomDataToCreate);

      if (!room) {
        return badRequest("Failed to create room.");
      }

      return created<Room>(room);
    } catch (error) {
      return serverError();
    }
  }
}
