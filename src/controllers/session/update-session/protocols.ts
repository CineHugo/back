/* eslint-disable no-unused-vars */
import { ObjectId } from "mongodb";
import { Session } from "../../../models/session";

export interface UpdateSessionParams {
  movie_id?: ObjectId;
  room_id?: ObjectId;
  starts_at?: Date;
  ends_at?: Date;
  duration_min?: number;
  base_price?: number;
}

export interface IUpdateSessionRepository {
  updateSession: (id: string, params: UpdateSessionParams) => Promise<Session>;
}
