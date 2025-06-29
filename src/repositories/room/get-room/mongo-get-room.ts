import { ObjectId } from "mongodb";
import { IGetRoomRepository } from "../../../controllers/room/get-room/protocols";
import { MongoClient } from "../../../database/mongo";
import { Room } from "../../../models/room";

export class MongoGetRoomRepository implements IGetRoomRepository{
    async getRoom(id: string): Promise<Room | null> {
        const room = await MongoClient.db
            .collection<Room>("rooms")
            .findOne({ _id: new ObjectId(id) });

        if (!room) {
            throw new Error("Room not found.");
        }

        return room;
    }
}