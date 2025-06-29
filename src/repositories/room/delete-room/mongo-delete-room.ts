import { ObjectId } from "mongodb";
import { MongoClient } from "../../../database/mongo";
import { Room } from "../../../models/room";
import { IDeleteRoomRepository } from "../../../controllers/room/delete-room/protocols";

export class MongoDeleteRoomRepository implements IDeleteRoomRepository {
  async deleteRoom(id: string): Promise<Room> {
    const room = await MongoClient.db
      .collection<Room>("rooms")
      .findOne({ _id: new ObjectId(id) });

    if (!room) {
      throw new Error("Room not found.");
    }

    const { deletedCount } = await MongoClient.db
      .collection("rooms")
      .deleteOne({ _id: new ObjectId(id) });

    if (!deletedCount) {
      throw new Error("Room not deleted.");
    }

    return room;
  }
}