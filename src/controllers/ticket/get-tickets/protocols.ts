import { Ticket } from "../../../models/ticket";

export interface IGetTicketsRepository {
  getTickets: () => Promise<Ticket[]>;
}