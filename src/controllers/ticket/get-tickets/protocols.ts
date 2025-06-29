/* eslint-disable no-unused-vars */
import { ObjectId } from "mongodb";
import { Ticket } from "../../../models/ticket";

export interface GetTicketsFilters {
  userId?: ObjectId;
  sessionId?: ObjectId;
  status?: 'ACTIVE' | 'USED' | 'CANCELLED';
}
export interface IGetTicketsRepository {
  getTickets: (filters?: GetTicketsFilters) => Promise<Ticket[]>;
}