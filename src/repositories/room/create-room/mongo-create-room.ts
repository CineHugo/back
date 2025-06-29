import { CreateRoomParams, ICreateRoomRepository } from "../../../controllers/room/create-room/protocols";
import { MongoClient } from "../../../database/mongo";
import { Room } from "../../../models/room";

export class MongoCreateRoomRepository implements ICreateRoomRepository {
  async createRoom(params: CreateRoomParams): Promise<Room> {
    // 1. VALIDAÇÃO BÁSICA (opcional, mas recomendado)
    if (!params.seatMap || params.seatMap.length === 0) {
      throw new Error("Cannot create a room with an empty seat map.");
    }
    
    // 2. CALCULAR A CAPACIDADE AUTOMATICAMENTE
    // A capacidade é simplesmente o número de assentos no mapa.
    const capacity = params.seatMap.length;

    // 3. PREPARAR O DOCUMENTO PARA INSERÇÃO
    const roomToInsert = {
      name: params.name,
      seatMap: params.seatMap, // O seatMap já vem como um array
      capacity: capacity,      // Usa a capacidade calculada
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    // 4. INSERIR NO BANCO DE DADOS
    const { insertedId } = await MongoClient.db
      .collection("rooms")
      .insertOne(roomToInsert);

    // 5. RETORNAR A SALA CRIADA
    const createdRoom = await MongoClient.db
      .collection<Room>("rooms")
      .findOne({ _id: insertedId });

    if (!createdRoom) {
      throw new Error("Room not created after insert!");
    }

    return createdRoom;
  }
}