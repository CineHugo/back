import { IGetSessionsRepository } from "../../../controllers/session/get-sessions/protocols";
import { MongoClient } from "../../../database/mongo";
import { Session } from "../../../models/session";
import { MongoSession } from "../../mongo-protocols";

export class MongoGetSessionsRepository implements IGetSessionsRepository {
    async getSessions(): Promise<Session[]> {
        const sessions = await MongoClient.db
            .collection<MongoSession>("sessions")
            .find({})
            .toArray();

        return sessions.map(({ _id, ...rest }) => ({
            ...rest,
            id: _id,
        }));
    }
}