/* eslint-disable no-unused-vars */
import { Ticket } from "../../../models/ticket";

export interface IGetTicketRepository {
  getTicket: (id: string) => Promise<Ticket | null>;
}