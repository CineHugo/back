/* eslint-disable no-useless-catch */
import { v4 as uuidv4 } from 'uuid';
import { MongoClient } from "../../../database/mongo";
import { Status, Ticket } from "../../../models/ticket";
import { CreateTicketParams, ICreateTicketRepository } from '../../../controllers/ticket/create-ticket/protocols';
import { ClientSession, ObjectId } from 'mongodb';

export class MongoCreateTicketRepository implements ICreateTicketRepository {

  async createTicket(params: CreateTicketParams, options?: { session?: ClientSession }): Promise<Ticket> {
    
    // Desestruturar os parâmetros para garantir que todos os campos necessários estão presentes.
    const {
      sessionId,
      userId,
      seatLabel,
      occupantName,
      occupantCpf,
      occupantEmail,
    } = params;

    // 1. PREPARAR O DOCUMENTO PARA INSERÇÃO
    const ticketToInsert = {
      sessionId: new ObjectId(sessionId),
      userId: new ObjectId(userId),
      seatLabel: seatLabel,
      occupantName: occupantName,
      occupantCpf: occupantCpf,
      occupantEmail: occupantEmail,
      qrUuid: uuidv4(),
      status: Status.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    };

    try {
      const { insertedId } = await MongoClient.db
        .collection("tickets")
        .insertOne(ticketToInsert, { session: options?.session });

      // A busca também precisa de estar dentro da sessão da transação para "ver" o documento inserido.
      const createdTicket = await MongoClient.db
        .collection<Ticket>("tickets")
        .findOne({ _id: insertedId }, { session: options?.session }); // Adicionada a opção de sessão

      if (!createdTicket) {
        throw new Error("Ticket not created after insert!");
      }

      return createdTicket;
    } catch (error) {
      // Re-lança o erro original do banco de dados para ser tratado pelo Controller.
      console.error("Error creating ticket:", error);
      throw error;
    }
  }
}
