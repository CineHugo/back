/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
import { User } from "../../models/user";
import { HttpRequest, HttpResponse } from "../protocols";

export interface IDeleteUserController {
    handle(httpRequest: HttpRequest<any>): Promise<HttpResponse<User>>;
}

export interface IDeleteUserRepository {
    deleteUser(id: string): Promise<User>;
}