import { IGetRoomsRepository } from "../../../controllers/room/get-rooms/protocols";
import { MongoClient } from "../../../database/mongo";
import { Room } from "../../../models/room";

export class MongoGetRoomsRepository implements IGetRoomsRepository {
  async getRooms(): Promise<Room[]> {
    const rooms = await MongoClient.db
      .collection<Room>("rooms")
      .find({})
      .toArray();

    return rooms;
  }
}
