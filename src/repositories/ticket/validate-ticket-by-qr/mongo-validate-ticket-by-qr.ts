import { IValidateTicketByQrRepository } from "../../../controllers/ticket/validate-ticket-by-qr/protocols";
import { MongoClient } from "../../../database/mongo";
import { Status, Ticket } from "../../../models/ticket";

export class MongoValidateTicketByQrRepository implements IValidateTicketByQrRepository {
  async validateTicketByQr(qrUuid: string): Promise<Ticket | null | 'already_used' | 'not_found'> {
    const ticket = await MongoClient.db.collection<Ticket>("tickets").findOne({ qrUuid });

    if (!ticket) {
      return 'not_found';
    }

    if (ticket.status !== Status.ACTIVE) {
      return 'already_used';
    }

    // Se estiver ativo, atualiza o status para "usado"
    const updateResult = await MongoClient.db
      .collection<Ticket>("tickets")
      .findOneAndUpdate(
        { _id: ticket._id, status: Status.ACTIVE }, // Garante a operação atômica
        { $set: { status: Status.USED, updatedAt: new Date() } },
        { returnDocument: "after" }
      );

    return updateResult; // Retorna o ticket atualizado
  }
}