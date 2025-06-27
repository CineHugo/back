import { IGetMoviesRepository } from "../../../controllers/movie/get-movies/protocols";
import { MongoClient } from "../../../database/mongo";
import { Movie } from "../../../models/movie";
import { MongoMovie } from "../../mongo-protocols";

export class MongoGetMoviesRepository implements IGetMoviesRepository {
  async getMovies(): Promise<Movie[]> {
    const movies = await MongoClient.db
      .collection<MongoMovie>("movies")
      .find({})
      .toArray();

    return movies.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id,
    }));
  }

}