/* eslint-disable no-useless-catch */
import { v4 as uuidv4 } from 'uuid'; // Lembre-se de instalar: npm install uuid && npm install --save-dev @types/uuid
import { MongoClient } from "../../../database/mongo";
import { Status, Ticket } from "../../../models/ticket";
import { CreateTicketParams, ICreateTicketRepository } from '../../../controllers/ticket/create-ticket/protocols';
import { ClientSession } from 'mongodb';

export class MongoCreateTicketRepository implements ICreateTicketRepository {

  async createTicket(params: CreateTicketParams, options?: { session?: ClientSession }): Promise<Ticket> {
    
    // 1. PREPARAR O DOCUMENTO PARA INSERÇÃO
    const ticketToInsert = {
      ...params,
      qrUuid: uuidv4(), // Gera um UUID único para o QR Code
      status: Status.ACTIVE as const, // Define o status inicial
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    try {
      const { insertedId } = await MongoClient.db
        .collection("tickets")
        .insertOne(ticketToInsert, { session: options?.session });

      const createdTicket = await MongoClient.db
        .collection<Ticket>("tickets")
        .findOne({ _id: insertedId });

      if (!createdTicket) {
        throw new Error("Ticket not created after insert!");
      }

      return createdTicket;
    } catch (error) {
      // Re-lança o erro original do banco de dados para ser tratado pelo Controller.
      throw error;
    }
  }
}