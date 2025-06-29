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
  ): Promise<Session> {
    const sessionId = new ObjectId(id);

    const currentSession = await MongoClient.db
      .collection<Session>("sessions")
      .findOne({ _id: sessionId });
    if (!currentSession) {
      throw new Error("Session not found");
    }

    const newStartsAt = params.startsAt
      ? new Date(params.startsAt)
      : currentSession.startsAt;
    const newDurationMin = params.durationMin ?? currentSession.durationMin;
    const newEndsAt = new Date(newStartsAt.getTime() + newDurationMin * 60000);

    // Usa o novo roomId se fornecido, senão mantém o atual.
    const newRoomId = params.roomId
      ? new ObjectId(params.roomId)
      : currentSession.roomId;

    const conflictingSession = await MongoClient.db
      .collection<Session>("sessions")
      .findOne({
        _id: { $ne: sessionId }, //
        roomId: newRoomId, // Verifica na sala correta (nova ou antiga)
        deleted_at: null,
        $or: [
          {
            startsAt: { $lt: newEndsAt },
            endsAt: { $gt: newStartsAt },
          },
        ],
      });

    if (conflictingSession) {
      throw new Error(
        `Conflict: A session already exists in this room from ${conflictingSession.startsAt.toLocaleTimeString("pt-BR")} to ${conflictingSession.endsAt.toLocaleTimeString("pt-BR")}.`
      );
    }

    const updateData = {
      ...params,
      ...(params.startsAt && { startsAt: newStartsAt }), // Atualiza se foi fornecido
      endsAt: newEndsAt,
      updated_at: new Date(),
    };

    await MongoClient.db
      .collection("sessions")
      .updateOne({ _id: sessionId }, { $set: updateData });

    const updatedSession = await MongoClient.db
      .collection<Session>("sessions")
      .findOne({ _id: sessionId });

    if (!updatedSession) {
      // Este erro não deveria acontecer em condições normais, mas é uma boa prática
      throw new Error("Failed to retrieve session after update.");
    }

    // Retorna o objeto completo e atualizado
    return updatedSession;
  }
}
