import { GetTicketsFilters, IGetTicketsRepository } from "../../../controllers/ticket/get-tickets/protocols";
import { MongoClient } from "../../../database/mongo";
import { Ticket, Status } from "../../../models/ticket";

export class MongoGetTicketsRepository implements IGetTicketsRepository {
  /**
   * Busca tickets no banco de dados com base em um objeto de filtros.
   * Se nenhum filtro for fornecido, retorna todos os tickets.
   */
  async getTickets(filters?: GetTicketsFilters): Promise<Ticket[]> {
    // A query de busca é construída dinamicamente a partir dos filtros.
    // O spread operator (...) no filters é uma forma elegante de construir o objeto de query.
    // Campos undefined no filters serão ignorados.
    const query: any = { ...filters };

    // Map string status to Status enum if present
    if (filters?.status) {
      query.status = Status[filters.status as keyof typeof Status];
    }

    const tickets = await MongoClient.db
      .collection<Ticket>("tickets")
      .find(query)
      .toArray();

    return tickets;
  }
}
