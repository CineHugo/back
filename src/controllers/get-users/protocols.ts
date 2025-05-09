/* eslint-disable no-undef */
import { User } from "../../models/user";
import { HttpResponse } from "../protocols";

export interface IGetUsersController {
    handle(): Promise<HttpResponse<User[]>>; // ou Promise<Response>, se tiver um tipo Response
}

export interface IGetUsersRepository {
    getUsers(): Promise<User[]>
}


