// src/repositories/user/update-user/mongo-update-user.ts

import { ObjectId } from "mongodb";
import { MongoClient } from "../../../database/mongo";
import { User } from "../../../models/user";
import {
  IUpdateUserRepository,
  UpdateUserParams,
} from "../../../controllers/user/update-user/protocols";
import bcrypt from "bcrypt";

export class MongoUpdateUserRepository implements IUpdateUserRepository {
  async updateUser(id: string, params: UpdateUserParams): Promise<User | null> {

    // 1. MANTIVEMOS SUA LÓGICA DE VALIDAÇÃO E HASH DE SENHA
    // Se uma nova senha for fornecida no 'params', nós validamos e fazemos o hash
    if (params.password) {
      const passwordStrong = (password: string): boolean => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
        return passwordRegex.test(password);
      };

      if (!passwordStrong(params.password)) {
        throw new Error("Password must be stronger");
      }

      params.password = await bcrypt.hash(params.password, 10);
    }

    // 2. LÓGICA DE ATUALIZAÇÃO OTIMIZADA E CORRIGIDA
    // Usamos o método 'findOneAndUpdate' para fazer a atualização e obter o documento
    // atualizado numa única operação atómica no banco de dados. É mais eficiente.
    const updatedUser = await MongoClient.db
      .collection<User>("users")
      .findOneAndUpdate(
        { _id: new ObjectId(id) }, // O filtro para encontrar o utilizador a ser atualizado
        {
          $set: {
            ...params, // Aplica todas as atualizações passadas em 'params'
            updatedAt: new Date(),
          },
        },
        {
          returnDocument: "after", // Esta opção garante que o documento retornado é a versão PÓS atualização
        }
      );

    // 3. RETORNO PADRONIZADO
    // O objeto 'updatedUser' retornado pelo findOneAndUpdate já tem o formato da nossa 
    // interface User (com _id). Retornamo-lo diretamente.
    return updatedUser;
  }
}