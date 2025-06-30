// repositories/ticket/get-ticket/mongo-get-ticket.ts

import { ObjectId } from "mongodb";
import { IGetTicketRepository } from "../../../controllers/ticket/get-ticket/protocols";
import { MongoClient } from "../../../database/mongo";
import { Ticket } from "../../../models/ticket";

export class MongoGetTicketRepository implements IGetTicketRepository {
  async getTicket(id: string): Promise<Ticket | null> {
    const aggregationPipeline = [
      // 1. Encontra o ticket pelo ID
      {
        $match: { _id: new ObjectId(id) },
      },
      // 2. Procura o utilizador associado
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      // 3. Procura a sessão associada
      {
        $lookup: {
          from: "sessions",
          localField: "sessionId",
          foreignField: "_id",
          as: "session",
        },
      },
      // 4. Desconstrói os resultados, MAS PRESERVA o ticket se algo falhar
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true, // <-- MUDANÇA CRÍTICA
        },
      },
      {
        $unwind: {
          path: "$session",
          preserveNullAndEmptyArrays: true, // <-- MUDANÇA CRÍTICA
        },
      },
      // 5. Procura o filme dentro da sessão
      {
        $lookup: {
          from: "movies",
          localField: "session.movieId",
          foreignField: "_id",
          as: "session.movie",
        },
      },
      {
        $unwind: {
          path: "$session.movie",
          preserveNullAndEmptyArrays: true, // <-- MUDANÇA CRÍTICA
        },
      },
      // 6. Projeta os campos finais de forma segura
      {
        $project: {
          _id: 1,
          seatLabel: 1,
          status: 1,
          qrUuid: 1,
          createdAt: 1,
          occupantName: 1,
          occupantCpf: 1,
          occupantEmail: 1,
          user: { // Garante que não falha se o utilizador não for encontrado
            _id: "$user._id",
            firstName: "$user.firstName",
            lastName: "$user.lastName",
            email: "$user.email",
          },
          session: { // Garante que não falha se a sessão/filme não forem encontrados
            _id: "$session._id",
            date: "$session.date",
            time: "$session.time",
            movie: {
              _id: "$session.movie._id",
              title: "$session.movie.title",
              poster: "$session.movie.poster",
            },
          },
        },
      },
    ];

    const tickets = await MongoClient.db
      .collection("tickets")
      .aggregate<Ticket>(aggregationPipeline)
      .toArray();

    if (!tickets || tickets.length === 0) {
      return null;
    }

    return tickets[0];
  }
}