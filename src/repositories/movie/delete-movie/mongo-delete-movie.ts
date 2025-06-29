import { ObjectId } from "mongodb";
import { IDeleteMovieRepository } from "../../../controllers/movie/delete-movie/protocols";
import { MongoClient } from "../../../database/mongo";
import { Movie } from "../../../models/movie";
import { MongoMovie } from "../../mongo-protocols";

export class MongoDeleteMovieRepository implements IDeleteMovieRepository {
  async deleteMovie(id: string): Promise<Movie> {
    const movie = await MongoClient.db
      .collection<MongoMovie>("movies")
      .findOne({ _id: new ObjectId(id) });

    if (!movie) {
      throw new Error("Movie not found.");
    }

    const { deletedCount } = await MongoClient.db
      .collection("movies")
      .deleteOne({ _id: new ObjectId(id) });

    if (!deletedCount) {
      throw new Error("Movie not deleted.");
    }

    const { _id, ...rest } = movie;

    return { id: _id, ...rest };
  }
}
