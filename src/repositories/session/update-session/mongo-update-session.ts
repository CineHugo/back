import { ObjectId } from "mongodb";
import { IUpdateSessionRepository, UpdateSessionParams } from "../../../controllers/session/update-session/protocols";
import { Session } from "../../../models/session";
import { MongoClient } from "../../../database/mongo";

export class MongoUpdateSessionRepository implements IUpdateSessionRepository {
  async updateSession(id: string, params: UpdateSessionParams): Promise<Session> {
    const sessionId = new ObjectId(id);

    const currentSession = await MongoClient.db.collection<Session>("sessions").findOne({ _id: sessionId });
    if (!currentSession) {
      throw new Error("Session not found");
    }

    const newStartsAt = params.starts_at ? new Date(params.starts_at) : currentSession.starts_at;
    const newDurationMin = params.duration_min ?? currentSession.duration_min;
    const newEndsAt = new Date(newStartsAt.getTime() + newDurationMin * 60000);

    // Usa o novo room_id se fornecido, senão mantém o atual.
    const newRoomId = params.room_id ? new ObjectId(params.room_id) : currentSession.room_id;

    const conflictingSession = await MongoClient.db.collection<Session>("sessions").findOne({
      _id: { $ne: sessionId }, // 
      room_id: newRoomId,       // Verifica na sala correta (nova ou antiga)
      deleted_at: null,
      $or: [
        {
          starts_at: { $lt: newEndsAt },
          ends_at: { $gt: newStartsAt }
        }
      ]
    });

    if (conflictingSession) {
      throw new Error(`Conflict: A session already exists in this room from ${conflictingSession.starts_at.toLocaleTimeString('pt-BR')} to ${conflictingSession.ends_at.toLocaleTimeString('pt-BR')}.`);
    }

    const updateData = {
      ...params,
      ...(params.starts_at && { starts_at: newStartsAt }), // Atualiza se foi fornecido
      ends_at: newEndsAt,
      updated_at: new Date(),
    };

    await MongoClient.db.collection("sessions").updateOne(
      { _id: sessionId },
      { $set: updateData }
    );

    const updatedSession = await MongoClient.db.collection<Session>("sessions").findOne({ _id: sessionId });
    
    if (!updatedSession) {
      // Este erro não deveria acontecer em condições normais, mas é uma boa prática
      throw new Error("Failed to retrieve session after update.");
    }

    // Retorna o objeto completo e atualizado
    return updatedSession;
  }
}