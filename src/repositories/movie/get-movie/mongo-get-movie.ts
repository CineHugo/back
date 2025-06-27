import { ObjectId } from "mongodb";
import { IGetMovieRepository } from "../../../controllers/movie/get-movie/protocols";
import { MongoClient } from "../../../database/mongo";
import { MongoMovie } from "../../mongo-protocols";
import { Movie } from "../../../models/movie";

export class MongoGetMovieRepository implements IGetMovieRepository {
  async getMovie(id: string): Promise<Movie | null> {
    const movie = await MongoClient.db
      .collection<MongoMovie>("movies")
      .findOne({ _id: new ObjectId(id) });

    if (!movie) {
      throw new Error("Movie not found.");
    }

    const { _id, ...rest } = movie;

    return { id: _id.toHexString(), ...rest };
  }
}