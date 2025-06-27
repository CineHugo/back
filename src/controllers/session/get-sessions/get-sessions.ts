/* eslint-disable no-unused-vars */
import { Session } from "../../../models/session";
import { ok, serverError } from "../../helpers";
import { HttpResponse, IController } from "../../protocols";
import { IGetSessionsRepository } from "./protocols";

export class GetSessionsController implements IController{
    constructor(private readonly sessionsRepository: IGetSessionsRepository) {}
    async handle(): Promise<HttpResponse<Session[] | string>> {
        try {
            // Validar a requisição
            // direcionar chamada para o repository
            const sessions = await this.sessionsRepository.getSessions();

            return ok<Session[]>(sessions);
        } catch (error) {
            // tratar a exceção
            return serverError();
        }
    }
}