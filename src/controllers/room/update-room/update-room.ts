/* eslint-disable no-unused-vars */
import { Room } from "../../../models/room";
import { badRequest, ok, serverError } from "../../helpers";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { IUpdateRoomRepository, UpdateRoomParams } from "./protocols";

export class UpdateRoomController implements IController {
  constructor(private readonly updateRoomRepository: IUpdateRoomRepository) {}
  async handle(
    httpRequest: HttpRequest<UpdateRoomParams>
  ): Promise<HttpResponse<Room | string>> {
    try {
      const id = httpRequest?.params?.id;
      const body = httpRequest?.body;

      if (!body) {
        return badRequest("Body missing fields");
      }

      if (!id) {
        return badRequest("Missing room id");
      }

      const allowedFieldsToUpdate: (keyof UpdateRoomParams)[] = [
        "name",
        "seatMap",
      ];

      const someFieldsAreNotAllowedToUpdate = Object.keys(body).some(
        (key) => !allowedFieldsToUpdate.includes(key as keyof UpdateRoomParams)
      );

      if (someFieldsAreNotAllowedToUpdate) {
        return badRequest("Some fields are not allowed to be updated");
      }

      await this.updateRoomRepository.updateRoom(id, body);

      return ok<Room>({ message: "Room updated successfully" });
    } catch (error) {
      return serverError();
    }
  }
}
