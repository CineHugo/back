import { IGetTicketsRepository } from "../../../controllers/ticket/get-tickets/protocols";
import { MongoClient } from "../../../database/mongo";
import { Ticket } from "../../../models/ticket";
import { MongoTicket } from "../../mongo-protocols";

export class MongoGetTicketsRepository implements IGetTicketsRepository {
  async getTickets(): Promise<Ticket[]> {
    const tickets = await MongoClient.db
      .collection<MongoTicket>("tickets")
      .find({})
      .toArray();

    return tickets;
  }
}