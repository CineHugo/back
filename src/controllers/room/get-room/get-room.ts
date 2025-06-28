/* eslint-disable no-unused-vars */
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { IGetRoomRepository } from "./protocols";
import { badRequest, serverError, ok } from "../../helpers";
import { Room } from "../../../models/room";

export class GetRoomController implements IController {
    constructor(private readonly getRoomRepository: IGetRoomRepository) {}
    async handle(
        httpRequest: HttpRequest<unknown>
    ): Promise<HttpResponse<unknown>> {
        try {
            const id = httpRequest?.params?.id;

            if (!id) {
                return badRequest("Missing room id");
            }

            const room = await this.getRoomRepository.getRoom(id);

            if (!room) {
                return badRequest("Room not found");
            }

            return ok<Room>(room);
        } catch (error) {
            return serverError();
        }
    }
}