import { ObjectId } from "mongodb";
import { IGetSessionRepository } from "../../../controllers/session/get-session/protocols";
import { MongoClient } from "../../../database/mongo";
import { Session } from "../../../models/session";
import { MongoSession } from "../../mongo-protocols";

export class MongoGetSessionRepository implements IGetSessionRepository {
    async getSession(id: string): Promise<Session | null> {
        const session = await MongoClient.db
            .collection<MongoSession>("sessions")
            .findOne({ _id: new ObjectId(id) });

        if (!session) {
            throw new Error("Session not found.");
        }

        const { _id, ...rest } = session;

        return { id: _id, ...rest };
    }
}