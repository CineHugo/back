import { Movie } from "../models/movie";
import { Session } from "../models/session";
import { Ticket } from "../models/ticket";
import { User } from "../models/user";

export type MongoUser = Omit<User, "id">;

export type MongoMovie = Omit<Movie, "id">;

export type MongoSession = Omit<Session, "id">;

export type MongoTicket = Omit<Ticket, "id">;