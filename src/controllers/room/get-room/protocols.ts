/* eslint-disable no-unused-vars */
import { Room } from "../../../models/room";

export interface IGetRoomRepository {
  getRoom: (id: string) => Promise<Room | null>;
}
