// src/repositories/user/delete-user/mongo-delete-user.ts

import { ObjectId } from "mongodb";
import { MongoClient } from "../../../database/mongo";
import { User } from "../../../models/user";
import { IDeleteUserRepository } from "../../../controllers/user/delete-user/protocols";

export class MongoDeleteUserRepository implements IDeleteUserRepository {
  async deleteUser(id: string): Promise<User | null> {
    
    // Usamos findOneAndDelete para encontrar e apagar numa só operação atómica.
    // Ele retorna o documento que foi apagado.
    const deletedUser = await MongoClient.db
      .collection<User>("users")
      .findOneAndDelete({ _id: new ObjectId(id) });

    // O 'deletedUser' retornado já tem o formato correto da nossa interface User (com _id).
    // Se nenhum documento for encontrado para apagar, ele retornará null, 
    // o que corresponde à nossa nova assinatura de interface.
    return deletedUser;
  }
}