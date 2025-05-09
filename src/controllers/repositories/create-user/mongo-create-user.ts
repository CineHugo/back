import { MongoClient } from "../../../database/mongo";
import { User, Role } from "../../../models/user";
import {
  CreateUserParams,
  ICreateUserRepository,
} from "../../create-user/protocols";

export class MongoCreateUserRepository implements ICreateUserRepository {
  async createUser(params: CreateUserParams): Promise<User> {
    const now = new Date();

    // Completa os dados com os campos obrigatórios
    const userData: Omit<User, "id"> = {
      ...params,
      role: Role.USER,
      rememberToken: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    const { insertedId } = await MongoClient.db
      .collection("users")
      .insertOne(userData);

    const user = await MongoClient.db
      .collection<Omit<User, "id">>("users")
      .findOne({ _id: insertedId });

    if (!user) {
      throw new Error("User not created!");
    }

    const { _id, ...rest } = user;

    return { id: _id.toHexString(), ...rest };
  }
}
