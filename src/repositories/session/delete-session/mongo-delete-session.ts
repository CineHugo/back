// src/repositories/session/delete-session/mongo-delete-session.ts

import { ObjectId } from "mongodb";
import { IDeleteSessionRepository } from "../../../controllers/session/delete-session/protocols";
import { MongoClient } from "../../../database/mongo";
import { Session } from "../../../models/session";

export class MongoDeleteSessionRepository implements IDeleteSessionRepository {
  async deleteSession(id: string): Promise<Session | null> {
    // Usa findOneAndDelete para apagar e retornar numa só operação
    const deletedSession = await MongoClient.db
      .collection<Session>("sessions")
      .findOneAndDelete({ _id: new ObjectId(id) });

    return deletedSession;
  }
}