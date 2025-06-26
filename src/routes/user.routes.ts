import { Router } from "express";
import { GetUsersController } from "../controllers/user/get-users/get-users";
import { MongoGetUsersRepository } from "../repositories/user/get-users/mongo-get-users";
import { MongoCreateUserRepository } from "../repositories/user/create-user/mongo-create-user";
import { CreateUserController } from "../controllers/user/create-user/create-user";
import { MongoUpdateUserRepository } from "../repositories/user/update-user/mongo-update-user";
import { UpdateUserController } from "../controllers/user/update-user/update-user";
import { MongoDeleteUserRepository } from "../repositories/user/delete-user/mongo-delete-user";
import { DeleteUserController } from "../controllers/user/delete-user/delete-user";
import { MongoGetUserRepository } from "../repositories/user/get-user/mongo-get-user";
import { GetUserController } from "../controllers/user/get-user/get-user";

const userRoutes = Router();

// Rota para listar todos os usuários
userRoutes.get("/", async (req, res) => {
  const mongoGetUsersRepository = new MongoGetUsersRepository();

  const getUsersController = new GetUsersController(mongoGetUsersRepository);

  const { body, statusCode } = await getUsersController.handle();

  res.status(statusCode).send(body);
});

// Rota para criar um novo usuário
userRoutes.post("/create/", async (req, res) => {
  const mongoCreateUserRepository = new MongoCreateUserRepository();

  const createUserController = new CreateUserController(
    mongoCreateUserRepository
  );

  const { body, statusCode } = await createUserController.handle({
    body: req.body,
  });

  res.status(statusCode).send(body);
});

// Rota para buscar um usuário específico pelo ID
userRoutes.get("/user/:id", async (req, res) => {
  const mongoGetUserRepository = new MongoGetUserRepository();

  const getUserController = new GetUserController(mongoGetUserRepository);

  const { body, statusCode } = await getUserController.handle({
    body: req.body,
    params: req.params,
  });

  res.status(statusCode).send(body);
});

// Rota para atualizar um usuário
userRoutes.patch("/update/:id", async (req, res) => {
  const mongoUpdateUserRepository = new MongoUpdateUserRepository();

  const updateUserController = new UpdateUserController(
    mongoUpdateUserRepository
  );

  const { body, statusCode } = await updateUserController.handle({
    body: req.body,
    params: req.params,
  });

  res.status(statusCode).send(body);
});

// Rota para deletar um usuário
userRoutes.delete("/delete/:id", async (req, res) => {
  const mongoDeleteUserRepository = new MongoDeleteUserRepository();

  const deleteUserController = new DeleteUserController(
    mongoDeleteUserRepository
  );

  const { body, statusCode } = await deleteUserController.handle({
    params: req.params,
  });

  res.status(statusCode).send(body);
});

export default userRoutes;
