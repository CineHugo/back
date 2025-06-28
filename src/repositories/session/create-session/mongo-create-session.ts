import { ObjectId } from "mongodb";
import {
  CreateSessionParams,
  ICreateSessionRepository,
} from "../../../controllers/session/create-session/protocols";
import { MongoClient } from "../../../database/mongo";
import { Session } from "../../../models/session";

export class MongoCreateSessionRepository implements ICreateSessionRepository {
  async createSession(params: CreateSessionParams): Promise<Session> {
    const starts_at = new Date(params.starts_at);
    const ends_at = new Date(starts_at.getTime() + params.duration_min * 60000); // Convert duration from minutes to milliseconds

    const conflictingSession = await MongoClient.db
      .collection<Session>("sessions")
      .findOne({
        room_id: new ObjectId(params.room_id), // Busca apenas na mesma sala
        deleted_at: null, // Ignora sessões com exclusão lógica
        $or: [
          {
            startsAt: { $lt: ends_at }, // A sessão existente começa ANTES do fim da nova
            endsAt: { $gt: starts_at }, // E termina DEPOIS do início da nova
          },
        ],
      });

    if (conflictingSession) {
      // Lança um erro claro que pode ser tratado pelo controller
      throw new Error(
        `Conflict: A session already exists in this room from ${conflictingSession.starts_at.toLocaleTimeString("pt-BR")} to ${conflictingSession.ends_at.toLocaleTimeString("pt-BR")}.`
      );
    }

    const sessionData = {
      ...params,
      starts_at: starts_at,
      ends_at: ends_at,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const { insertedId } = await MongoClient.db
      .collection("sessions")
      .insertOne(sessionData);

    const session = await MongoClient.db
      .collection<Session>("sessions")
      .findOne({ _id: insertedId });

    if (!session) {
      throw new Error("Session not created!");
    }

    return session;
  }
}
