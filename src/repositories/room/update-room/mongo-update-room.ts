import { ObjectId } from "mongodb";
import { IUpdateRoomRepository, UpdateRoomParams } from "../../../controllers/room/update-room/protocols";
import { MongoClient } from "../../../database/mongo";
import { Room } from "../../../models/room";
import { Session } from "../../../models/session";

export class MongoUpdateRoomRepository implements IUpdateRoomRepository {
  async updateRoom(id: string, params: UpdateRoomParams): Promise<Room> {
    const roomId = new ObjectId(id);

    // 1. VERIFICAR SE A SALA EXISTE
    const roomExists = await MongoClient.db.collection<Room>("rooms").findOne({ _id: roomId, deletedAt: null });
    if (!roomExists) {
      throw new Error("Room not found.");
    }
    
    // 2. REGRA DE NEGÓCIO: BLOQUEAR ALTERAÇÃO DO MAPA DE ASSENTOS SE HOUVER SESSÕES FUTURAS
    if (params.seatMap) {
      const futureSession = await MongoClient.db.collection<Session>("sessions").findOne({
        roomId: roomId,
        startsAt: { $gte: new Date() }, // Verifica se a sessão começa a partir de agora
        deletedAt: null,
      });

      if (futureSession) {
        throw new Error("Cannot update seat map: This room has upcoming sessions scheduled.");
      }
    }

    // 3. PREPARAR O OBJETO DE ATUALIZAÇÃO
    const updateData: { [key: string]: any } = { ...params };

    // Se o seatMap foi atualizado, recalcula a capacidade
    if (params.seatMap) {
      if(params.seatMap.length === 0) {
        throw new Error("Cannot update room with an empty seat map.");
      }
      updateData.capacity = params.seatMap.length;
    }

    // Sempre atualiza a data de modificação
    updateData.updatedAt = new Date();
    
    // 4. ATUALIZAR O DOCUMENTO NO BANCO DE DADOS
    await MongoClient.db.collection("rooms").updateOne(
      { _id: roomId },
      { $set: updateData }
    );
    
    // 5. BUSCAR E RETORNAR O DOCUMENTO ATUALIZADO
    const updatedRoom = await MongoClient.db
      .collection<Room>("rooms")
      .findOne({ _id: roomId });

    if (!updatedRoom) {
      throw new Error("Failed to retrieve room after update.");
    }
    
    return updatedRoom;
  }
}