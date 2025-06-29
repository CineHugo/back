/* eslint-disable no-unused-vars */
import { ObjectId } from "mongodb";
import { Session } from "../../../models/session";

export interface CreateSessionParams {
  movieId: ObjectId;
  roomId: ObjectId;
  startsAt: Date;
  durationMin: number;
  basePrice: number;
}
export interface ICreateSessionRepository {
  createSession(params: CreateSessionParams): Promise<Session>;
}
