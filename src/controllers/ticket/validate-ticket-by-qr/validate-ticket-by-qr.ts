import {
  badRequest,
  forbidden,
  notFound,
  ok,
  serverError,
  conflict,
} from "../../helpers";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { User, Role } from "../../../models/user";
import { IValidateTicketByQrRepository } from "./protocols";

export class ValidateTicketByQrController implements IController {
  constructor(
    private readonly validateTicketRepo: IValidateTicketByQrRepository
  ) {}

  async handle(
    httpRequest: HttpRequest<{ qrUuid: string }>
  ): Promise<HttpResponse<any>> {
    try {
      const user = httpRequest.user as User;
      const { qrUuid } = httpRequest.body!;

      if (user.role !== Role.ADMIN) {
        return forbidden("Only administrators can validate tickets.");
      }

      if (!qrUuid) {
        return badRequest("Missing qrUuid in request body.");
      }

      const result = await this.validateTicketRepo.validateTicketByQr(qrUuid);

      if (result === "not_found") {
        return notFound("ERRO: Ingresso inválido ou não encontrado.");
      }

      if (result === "already_used") {
        return conflict("ATENÇÃO: Este ingresso já foi utilizado.");
      }

      // Sucesso! Retorna o ingresso que foi validado
      return ok({ message: "SUCESSO: Ingresso validado!", ticket: result });
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}