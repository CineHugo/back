// src/repositories/movie/delete-movie/mongo-delete-movie.ts

import { ObjectId } from "mongodb";
import { MongoClient } from "../../../database/mongo";
import { Movie } from "../../../models/movie";
import { IDeleteMovieRepository } from "../../../controllers/movie/delete-movie/protocols";

export class MongoDeleteMovieRepository implements IDeleteMovieRepository {
  async deleteMovie(id: string): Promise<Movie | null> {
    
    // Usamos findOneAndDelete para encontrar, apagar e retornar o documento numa só operação.
    const deletedMovie = await MongoClient.db
      .collection<Movie>("movies")
      .findOneAndDelete({ _id: new ObjectId(id) });

    // O 'deletedMovie' retornado já tem o formato correto da nossa interface Movie (com _id).
    // Se nenhum filme for encontrado, ele retornará null, correspondendo ao nosso contrato.
    return deletedMovie;
  }
}