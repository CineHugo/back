/* eslint-disable no-unused-vars */
import { Room } from "../../../models/room";

export interface IDeleteRoomRepository {
  deleteRoom(id: string): Promise<Room>;
}