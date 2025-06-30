// src/repositories/movie/get-movie/mongo-get-movie.ts

import { ObjectId } from "mongodb";
import { IGetMovieRepository } from "../../../controllers/movie/get-movie/protocols";
import { MongoClient } from "../../../database/mongo";
import { Movie } from "../../../models/movie";

export class MongoGetMovieRepository implements IGetMovieRepository {
  async getMovie(id: string): Promise<Movie | null> {
    
    // Busca o filme pelo _id. O resultado já corresponde à nossa interface Movie.
    const movie = await MongoClient.db
      .collection<Movie>("movies")
      .findOne({ _id: new ObjectId(id) });

    // Retorna o filme encontrado, ou null se não existir.
    // Nenhuma transformação é necessária.
    return movie;
  }
}