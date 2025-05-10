/* eslint-disable no-unused-vars */
import { IController } from "../protocols";
import { IGetUsersRepository } from "./protocols";


export class GetUsersController implements IController {
  // getUsersRepository: IGetUsersRepository;

  // constructor(getUsersRepository: IGetUsersRepository) {
  //     this.getUsersRepository = getUsersRepository;
  // }

  constructor(private readonly getUsersRepository: IGetUsersRepository) {}

  async handle() {
    try {
      // Validar a requisição
      // direcionar chamada para o repository
      const users = await this.getUsersRepository.getUsers();

      return {
        statusCode: 200,
        body: users,
      };
    } catch (error) {
      // tratar a exceção
      return {
        statusCode: 500,
        body: "Something went wrong!",
      };
    }
  }
}
