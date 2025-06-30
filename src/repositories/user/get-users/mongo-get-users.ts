import { MongoClient } from "../../../database/mongo";
import { User } from "../../../models/user";
import { IGetUsersRepository } from "../../../controllers/user/get-users/protocols";

export class MongoGetUsersRepository implements IGetUsersRepository {
  async getUsers(): Promise<User[]> {
    const users = await MongoClient.db
      .collection<User>("users")
      .find({})
      .toArray();

    return users;

    // return [{
    //     id: 0,
    //     firstName: 'Dilceu',
    //     lastName: 'Lopes',
    //     role: Role.USER,
    //     email: 'dilceu.lopes@outlook.com',
    //     password: '123123',
    //     rememberToken: null,
    //     createdAt: new Date("2025-03-12T00:00:00Z"),
    //     updatedAt: new Date("2025-03-12T00:00:00Z"),
    //     deletedAt: null
    // }];
  }
}
