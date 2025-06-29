import { ObjectId } from "mongodb";
import { IGetTicketRepository } from "../../../controllers/ticket/get-ticket/protocols";
import { MongoClient } from "../../../database/mongo";
import { Ticket } from "../../../models/ticket";
import { MongoTicket } from "../../mongo-protocols";

export class MongoGetTicketRepository implements IGetTicketRepository {
  async getTicket(id: string): Promise<Ticket | null> {
    const ticket = await MongoClient.db
      .collection<MongoTicket>("tickets")
      .findOne({ _id: new ObjectId(id) });

    if (!ticket) {
      throw new Error("Ticket not found.");
    }

    const { _id, ...rest } = ticket;

    return { _id: _id, ...rest };
  }
}