/* eslint-disable no-unused-vars */
import { ClientSession, ObjectId } from "mongodb";
import { Ticket } from "../../../models/ticket";

export interface CreateTicketParams {
  sessionId: ObjectId;
  userId: ObjectId;
  seatLabel: string;
  occupantName: string;
  occupantEmail: string;
  occupantCpf: string;
}

export interface ICreateTicketRepository {
  createTicket(params: CreateTicketParams, options?: { session?: ClientSession }): Promise<Ticket>;
}
