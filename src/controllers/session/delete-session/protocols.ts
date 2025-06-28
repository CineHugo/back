/* eslint-disable no-unused-vars */

import { Session } from "../../../models/session";

export interface IDeleteSessionRepository {
  deleteSession(id: string): Promise<Session>;
}
