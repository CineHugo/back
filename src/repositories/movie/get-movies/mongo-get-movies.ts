// src/repositories/movie/get-movies/mongo-get-movies.ts

import { IGetMoviesRepository } from "../../../controllers/movie/get-movies/protocols";
import { MongoClient } from "../../../database/mongo";
import { Movie } from "../../../models/movie";

export class MongoGetMoviesRepository implements IGetMoviesRepository {
  async getMovies(): Promise<Movie[]> {
    
    // Buscamos os filmes e o resultado já corresponde à nossa interface Movie.
    const movies = await MongoClient.db
      .collection<Movie>("movies")
      .find({}) // Busca todos os filmes
      .toArray();

    // Nenhuma transformação de 'id'/'_id' é necessária, pois a estrutura do banco (_id)
    // agora corresponde à nossa interface padronizada.
    return movies;
  }
}