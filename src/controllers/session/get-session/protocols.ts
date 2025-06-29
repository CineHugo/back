/* eslint-disable no-unused-vars */
import { Session } from "../../../models/session";

export interface IGetSessionRepository {
    getSession: (id: string) => Promise<Session | null>;
}