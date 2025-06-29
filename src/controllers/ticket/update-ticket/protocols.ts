/* eslint-disable no-unused-vars */
// src/controllers/ticket/update-ticket-status/protocols.ts

import { Ticket, Status } from "../../../models/ticket"; // 1. Importar o enum Status do seu model

/**
 * Contrato para o repositório de atualização de status de ticket.
 */
export interface IUpdateTicketRepository {
  /**
   * Atualiza o status de um ticket específico.
   * @param id - O ID do ticket a ser atualizado.
   * @param status - O novo status para o ticket, usando o tipo do enum.
   * @returns O ticket atualizado ou null se não for encontrado.
   */
  updateTicketStatus(id: string, status: Status): Promise<Ticket | null>;
}
