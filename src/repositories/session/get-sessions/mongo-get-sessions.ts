// src/repositories/session/get-sessions/mongo-get-sessions.ts

import { IGetSessionsRepository } from "../../../controllers/session/get-sessions/protocols";
import { MongoClient } from "../../../database/mongo";
import { Session } from "../../../models/session";

export class MongoGetSessionsRepository implements IGetSessionsRepository {
  async getSessions(): Promise<Session[]> {
    const sessions = await MongoClient.db
      .collection<Session>("sessions")
      .find({})
      .toArray();

    // Retorna diretamente, pois a estrutura já está correta (_id)
    return sessions;
  }
}