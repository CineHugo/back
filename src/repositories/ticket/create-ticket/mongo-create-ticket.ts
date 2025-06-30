/* eslint-disable no-useless-catch */
import { v4 as uuidv4 } from "uuid";
import { MongoClient } from "../../../database/mongo";
import { Status, Ticket } from "../../../models/ticket";
import {
  CreateTicketParams,
  ICreateTicketRepository,
} from "../../../controllers/ticket/create-ticket/protocols";
import { ClientSession, ObjectId } from "mongodb";

export class MongoCreateTicketRepository implements ICreateTicketRepository {
  async createTicket(
    params: CreateTicketParams,
    options?: { session?: ClientSession }
  ): Promise<Ticket> {
    // 1. PREPARAMOS O DOCUMENTO COMPLETO QUE QUEREMOS CRIAR
    // Geramos o _id aqui mesmo, para já o termos disponível.
    const ticketToInsert = {
      _id: new ObjectId(),
      sessionId: new ObjectId(params.sessionId),
      userId: new ObjectId(params.userId),
      seatLabel: params.seatLabel,
      occupantName: params.occupantName,
      occupantCpf: params.occupantCpf,
      occupantEmail: params.occupantEmail,
      qrUuid: uuidv4(),
      status: Status.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    try {
      // 2. INSERIMOS O DOCUMENTO COMPLETO, PASSANDO A SESSÃO DA TRANSAÇÃO
      const result = await MongoClient.db
        .collection("tickets")
        .insertOne(ticketToInsert, { session: options?.session });

      // 3. VERIFICAMOS SE A INSERÇÃO FOI RECONHECIDA PELO BANCO
      if (!result.insertedId) {
        throw new Error("MongoDB failed to acknowledge the ticket insertion.");
      }

      // 4. RETORNAMOS O OBJETO QUE JÁ TEMOS EM MÃOS. SEM BUSCA EXTRA!
      // A aserção de tipo garante que o retorno corresponde à interface Ticket.
      return ticketToInsert as unknown as Ticket;
    } catch (error) {
      // Re-lança o erro original do banco para ser tratado pelo Controller.
      console.error("Error creating ticket:", error);
      throw error;
    }
  }
}
