/* eslint-disable no-unused-vars */

export interface IDeleteSessionRepository {
  deleteSession(id: string): Promise<void>;
}
