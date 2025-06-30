/* eslint-disable no-unused-vars */
import { ObjectId } from "mongodb";
import { Session } from "../../../models/session";

export interface UpdateSessionParams {
  movieId?: ObjectId;
  roomId?: ObjectId;
  startsAt?: Date;
  durationMin?: number;
  basePrice?: number;
}

export interface IUpdateSessionRepository {
  updateSession: (id: string, params: UpdateSessionParams) => Promise<Session | null>;
}
