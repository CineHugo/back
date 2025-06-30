/* eslint-disable no-unused-vars */
import { PopulatedTicket } from "../../../models/ticket";

export interface IGetTicketRepository {
  getTicket: (id: string) => Promise<PopulatedTicket | null>;
}