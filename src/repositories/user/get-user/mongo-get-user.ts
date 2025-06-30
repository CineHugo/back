// src/repositories/user/get-user/mongo-get-user.ts

import { ObjectId } from "mongodb";
import { IGetUserRepository } from "../../../controllers/user/get-user/protocols";
import { MongoClient } from "../../../database/mongo";
import { User } from "../../../models/user";

export class MongoGetUserRepository implements IGetUserRepository {
  async getUser(id: string): Promise<User | null> {
    
    // A busca é feita e o resultado já corresponde à nossa interface User.
    const user = await MongoClient.db
      .collection<User>("users")
      .findOne({ _id: new ObjectId(id) });

    // Se o utilizador não for encontrado, findOne retorna null.
    // Retornar null aqui é uma prática melhor do que lançar um erro, pois
    // permite que o controller decida o que fazer (ex: retornar um 404 Not Found).
    if (!user) {
      return null;
    }

    // Retornamos o utilizador diretamente, sem transformações.
    return user;
  }
}