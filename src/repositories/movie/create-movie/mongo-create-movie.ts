import {
  CreateMovieParams,
  ICreateMovieRepository,
} from "../../../controllers/movie/create-movie/protocols";
import { MongoClient } from "../../../database/mongo";
import { Movie } from "../../../models/movie";
import { MongoMovie } from "../../mongo-protocols";

export class MongoCreateMovieRepository implements ICreateMovieRepository {
  async createMovie(params: CreateMovieParams): Promise<Movie> {
    const movieData: MongoMovie = {
      ...params,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const { insertedId } = await MongoClient.db
      .collection("movies")
      .insertOne(movieData);

    const movie = await MongoClient.db
      .collection<MongoMovie>("movies")
      .findOne({ _id: insertedId });

    if (!movie) {
      throw new Error("Movie not created!");
    }

    const { _id, ...rest } = movie;

    return { id: _id, ...rest };
  }
}
