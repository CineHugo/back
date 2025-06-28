import { ObjectId } from "mongodb";
import { IDeleteSessionRepository } from "../../../controllers/session/delete-session/protocols";
import { MongoClient } from "../../../database/mongo";
import { Session } from "../../../models/session";
import { MongoSession } from "../../mongo-protocols";

export class MongoDeleteSessionRepository implements IDeleteSessionRepository {
    async deleteSession(id: string): Promise<Session> {
        const session = await MongoClient.db
            .collection<MongoSession>("sessions")
            .findOne({ _id: new ObjectId(id) });

        if (!session) {
            throw new Error("Session not found.");
        }

        const { deletedCount } = await MongoClient.db
            .collection("sessions")
            .deleteOne({ _id: new ObjectId(id) });

        if (!deletedCount) {
            throw new Error("Session not deleted.");
        }

        const { _id, ...rest } = session;

        return { id: _id, ...rest };
    }
}