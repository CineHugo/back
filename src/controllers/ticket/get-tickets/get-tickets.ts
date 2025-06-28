/* eslint-disable no-unused-vars */
import { Room } from "../../../models/room";
import { ok, serverError } from "../../helpers";
import { HttpResponse, IController } from "../../protocols";
import { IGetRoomsRepository } from "../../room/get-rooms/protocols";

export class GetRoomsController implements IController {
    constructor(private readonly roomsRepository: IGetRoomsRepository) {}

    async handle(): Promise<HttpResponse<Room[] | string>> {
        try {
            // Validar a requisição
            // direcionar chamada para o repository
            const rooms = await this.roomsRepository.getRooms();

            return ok<Room[]>(rooms);
        } catch (error) {
            // tratar a exceção
            return serverError();
        }
    }
}