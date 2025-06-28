import { Room } from "../../../models/room";

export interface IGetRoomsRepository {
  getRooms: () => Promise<Room[]>;
}
