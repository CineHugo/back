import { Movie } from "../models/movie";
import { User } from "../models/user";

export type MongoUser = Omit<User, "id">;

export type MongoMovie = Omit<Movie, "id">;
