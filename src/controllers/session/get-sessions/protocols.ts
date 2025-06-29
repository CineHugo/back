import { Session } from "../../../models/session";

export interface IGetSessionsRepository {
  getSessions: () => Promise<Session[]>;
}
