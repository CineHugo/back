import { ObjectId } from "mongodb";
import { IGetSessionRepository } from "../../../controllers/session/get-session/protocols";
import { MongoClient } from "../../../database/mongo";
import { Session } from "../../../models/session";


export interface SessionDetails extends Session {
  roomDetails: {
    name: string;
    capacity: number;
    seatMap: any[];
  };
  ticketsInfo: {
    soldCount: number;
    availableCount: number;
    soldSeats: string[]; // Lista de labels dos assentos vendidos, ex: ["A1", "C5"]
  };
}

export class MongoGetSessionRepository implements IGetSessionRepository {

  async getSession(id: string): Promise<SessionDetails | null> {
    const session = await MongoClient.db
      .collection<Session>("sessions")
      .aggregate<SessionDetails>([
        // 1. Encontra a sessão específica pelo ID
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        // 2. JUNTA com a coleção 'rooms' para pegar os detalhes da sala
        {
          $lookup: {
            from: "rooms",
            localField: "roomId",
            foreignField: "_id",
            as: "roomDetails",
          },
        },
        // 3. JUNTA com a coleção 'tickets' para encontrar os ingressos vendidos
        {
          $lookup: {
            from: "tickets",
            localField: "_id", // O _id da sessão
            foreignField: "sessionId", // Corresponde ao sessionId no ticket
            as: "soldTickets", // Array com todos os tickets vendidos para esta sessão
          },
        },
        // 4. Transforma o 'roomDetails' de um array para um objeto
        {
          $unwind: "$roomDetails",
        },
        // 5. Adiciona os campos calculados de contagem de ingressos
        {
          $addFields: {
            "ticketsInfo.soldCount": { $size: "$soldTickets" },
            "ticketsInfo.availableCount": {
              $subtract: ["$roomDetails.capacity", { $size: "$soldTickets" }],
            },
            "ticketsInfo.soldSeats": "$soldTickets.seatLabel",
          },
        },
        // 6. Remove o array grande de 'soldTickets' da resposta final
        {
          $project: {
            soldTickets: 0,
          },
        },
      ])
      .next(); // aggregate retorna um cursor, .next() pega o primeiro (e único) resultado

    return session;
  }
}
