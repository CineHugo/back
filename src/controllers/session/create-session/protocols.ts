/* eslint-disable no-unused-vars */
import { Session } from "../../../models/session";

export interface CreateSessionParams {
  movie_id: string;
  room_id: string;
  starts_at: Date;
  ends_at: Date;
  duration_min: number;
  base_price: number;
}
export interface ICreateSessionRepository {
  createSession(params: CreateSessionParams): Promise<Session>;
}