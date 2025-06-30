// src/repositories/user/create-user/mongo-create-user.ts

import { MongoClient } from "../../../database/mongo";
import { User, Role } from "../../../models/user";
import {
  CreateUserParams,
  ICreateUserRepository,
} from "../../../controllers/user/create-user/protocols";
import bcrypt from "bcrypt";

export class MongoCreateUserRepository implements ICreateUserRepository {
  async createUser(params: CreateUserParams): Promise<User> {

    // 1. MANTIVEMOS AS SUAS VALIDAÇÕES IMPORTANTES
    const emailExists = await MongoClient.db
      .collection("users")
      .findOne({ email: params.email });

    if (emailExists) {
      throw new Error("Email already in use");
    }

    const passwordStrong = (password: string): boolean => {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
      return passwordRegex.test(password);
    };

    if (!passwordStrong(params.password)) {
      throw new Error("Password must be stronger");
    }

    // 2. PREPARAÇÃO DOS DADOS
    const hashedPassword = await bcrypt.hash(params.password, 10);

    const userToInsert = {
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      password: hashedPassword,
      role: Role.USER,
      rememberToken: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    // 3. INSERÇÃO NO BANCO
    const result = await MongoClient.db
      .collection("users")
      .insertOne(userToInsert);

    // 4. BUSCA DO DOCUMENTO CRIADO
    const createdUser = await MongoClient.db
      .collection<User>("users")
      .findOne({ _id: result.insertedId });

    if (!createdUser) {
      throw new Error("User not created after insert!");
    }

    // 5. RETORNO CORRETO E PADRONIZADO
    // O objeto `createdUser` já tem a estrutura correta com `_id`,
    // correspondendo à nossa interface `User`. Retornamos ele diretamente.
    return createdUser;
  }
}