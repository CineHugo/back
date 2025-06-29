// src/repositories/ticket/MongoUpdateTicketRepository.ts

import { ObjectId } from "mongodb";
import { IUpdateTicketRepository } from "../../../controllers/ticket/update-ticket/protocols";
import { MongoClient } from "../../../database/mongo";
import { Ticket, Status } from "../../../models/ticket"; // Importando o enum Status

export class MongoUpdateTicketRepository implements IUpdateTicketRepository {

  /**
   * Encontra um ticket pelo seu ID e atualiza seu status.
   * A operação é atômica para garantir consistência.
   */
  async updateTicketStatus(id: string, status: Status): Promise<Ticket | null> {
    
    // O findOneAndUpdate é perfeito aqui: ele encontra, atualiza e retorna o documento
    // (antes ou depois da atualização, dependendo da opção 'returnDocument').
    const updatedTicket = await MongoClient.db
      .collection<Ticket>("tickets")
      .findOneAndUpdate(
        { _id: new ObjectId(id) }, // Critério de busca
        { 
          $set: { 
            status: status, // Usando o valor do enum
            updatedAt: new Date() 
          } 
        }, // A atualização a ser aplicada
        { returnDocument: "after" } // Opção para retornar o documento *depois* da atualização
      );

    return updatedTicket;
  }
}
