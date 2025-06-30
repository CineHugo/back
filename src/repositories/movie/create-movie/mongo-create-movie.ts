// src/repositories/movie/create-movie/mongo-create-movie.ts

import { ICreateMovieRepository, CreateMovieParams } from "../../../controllers/movie/create-movie/protocols";
import { MongoClient } from "../../../database/mongo";
import { Movie } from "../../../models/movie";

export class MongoCreateMovieRepository implements ICreateMovieRepository {
  async createMovie(params: CreateMovieParams): Promise<Movie> {
    
    // 1. Preparar o documento do filme para inserção
    const movieToInsert = {
      title: params.title,
      synopsis: params.synopsis,
      releaseDate: new Date(params.releaseDate), // Garante que o campo é um objeto Date
      mainImageUrl: params.mainImageUrl,
      bannerImageUrl: params.bannerImageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    // 2. Inserir o filme no banco de dados
    const result = await MongoClient.db
      .collection("movies")
      .insertOne(movieToInsert);

    // 3. Buscar o filme recém-criado para obter o objeto completo com o _id gerado
    const createdMovie = await MongoClient.db
      .collection<Movie>("movies")
      .findOne({ _id: result.insertedId });

    if (!createdMovie) {
      throw new Error("Movie not created after insert.");
    }

    // 4. Retornar o filme criado. A sua estrutura já corresponde à interface Movie.
    return createdMovie;
  }
}