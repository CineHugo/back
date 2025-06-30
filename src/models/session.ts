import { ObjectId } from "mongodb";
import { Movie } from "./movie";

export interface Session {
  _id: ObjectId;
  movieId: ObjectId;
  roomId: ObjectId;
  startsAt: Date;
  endsAt: Date; // Será calculado a partir de startsAt e durationMin
  durationMin: number;
  basePrice: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

// Interface para a Sessão com dados populados
export interface PopulatedSession extends Omit<Session, 'movieId' | 'roomId'> {
    movie: Movie;
    room: any; // Room pode ser 'any' ou a interface Room importada
}