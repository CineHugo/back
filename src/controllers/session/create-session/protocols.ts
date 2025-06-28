/* eslint-disable no-unused-vars */
import { ObjectId } from "mongodb";
import { Session } from "../../../models/session";

export interface CreateSessionParams {
  movie_id: ObjectId;
  room_id: ObjectId;
  starts_at: Date;
  duration_min: number;
  base_price: number;
}
export interface ICreateSessionRepository {
  createSession(params: CreateSessionParams): Promise<Session>;
}