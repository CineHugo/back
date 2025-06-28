/* eslint-disable no-unused-vars */
import { Room, Seat } from "../../../models/room";

export interface CreateRoomParams {
  name: string;
  seatMap: Seat[];
}

export interface ICreateRoomRepository {
  createRoom(params: CreateRoomParams): Promise<Room>;
}
