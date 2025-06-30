import { Ticket } from "../../../models/ticket";

export interface IValidateTicketByQrRepository {
  validateTicketByQr(
    _qrUuid: string
  ): Promise<Ticket | null | "already_used" | "not_found">;
}
