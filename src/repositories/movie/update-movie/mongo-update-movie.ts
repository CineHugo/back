// src/repositories/movie/update-movie/mongo-update-movie.ts

import { ObjectId } from "mongodb";
import { IUpdateMovieRepository, UpdateMovieParams } from "../../../controllers/movie/update-movie/protocols";
import { MongoClient } from "../../../database/mongo";
import { Movie } from "../../../models/movie";

export class MongoUpdateMovieRepository implements IUpdateMovieRepository {
  async updateMovie(id: string, params: UpdateMovieParams): Promise<Movie | null> {
    
    // Usamos findOneAndUpdate para atualizar e retornar o documento em uma só operação.
    const updatedMovie = await MongoClient.db
      .collection<Movie>("movies")
      .findOneAndUpdate(
        { _id: new ObjectId(id) }, // Critério de busca
        { 
          $set: { 
            ...params,
            updatedAt: new Date() 
          } 
        }, // A atualização a ser aplicada
        { returnDocument: "after" } // Retorna o documento *depois* da atualização
      );

    // Retornamos o filme atualizado diretamente.
    // A sua estrutura já corresponde à interface Movie (com _id).
    return updatedMovie;
  }
}