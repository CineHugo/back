// src/repositories/session/update-session/mongo-update-session.ts
import { ObjectId } from "mongodb";
import {
  IUpdateSessionRepository,
  UpdateSessionParams,
} from "../../../controllers/session/update-session/protocols";
import { Session } from "../../../models/session";
import { MongoClient } from "../../../database/mongo";

export class MongoUpdateSessionRepository implements IUpdateSessionRepository {
  async updateSession(
    id: string,
    params: UpdateSessionParams
  ): Promise<Session | null> {
    const sessionId = new ObjectId(id);

    // Mantém a sua excelente lógica de verificação de conflitos
    if (params.startsAt || params.roomId) {
        const currentSession = await MongoClient.db.collection<Session>("sessions").findOne({ _id: sessionId });
        if (!currentSession) throw new Error("Session not found to check for conflicts.");
        
        const newStartsAt = params.startsAt ? new Date(params.startsAt) : currentSession.startsAt;
        const newDurationMin = params.durationMin ?? currentSession.durationMin;
        const newEndsAt = new Date(newStartsAt.getTime() + newDurationMin * 60000);
        const newRoomId = params.roomId ? new ObjectId(params.roomId) : currentSession.roomId;

        const conflictingSession = await MongoClient.db.collection<Session>("sessions").findOne({
            _id: { $ne: sessionId },
            roomId: newRoomId,
            deletedAt: null,
            $or: [
                { startsAt: { $lt: newEndsAt }, endsAt: { $gt: newStartsAt } },
            ],
        });

        if (conflictingSession) {
            throw new Error(`Conflict: A session already exists in this room from ${conflictingSession.startsAt.toLocaleTimeString("pt-BR")} to ${conflictingSession.endsAt.toLocaleTimeString("pt-BR")}.`);
        }
    }

    // Otimiza a atualização usando findOneAndUpdate
    const updatedSession = await MongoClient.db
      .collection<Session>("sessions")
      .findOneAndUpdate(
        { _id: sessionId },
        { $set: { ...params, updatedAt: new Date() } },
        { returnDocument: "after" }
      );

    return updatedSession;
  }
}