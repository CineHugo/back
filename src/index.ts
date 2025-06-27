/* eslint-disable no-unused-vars */
import express from "express";
import path from 'path';
import { config } from "dotenv";
import { MongoClient } from "./database/mongo";
import userRoutes from "./routes/user.routes"; // Importa as rotas de usuário
import authRoutes from "./routes/auth.routes"; // Importa as rotas de autenticação
import moviesRoutes from "./routes/movies.routes";

const main = async () => {
  config();

  const app = express();

  app.use(express.json({ limit: '10mb' }));

  // app.use(express.json());

  await MongoClient.connect();

  app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));

  app.use(authRoutes);

  app.use("/users", userRoutes);

  app.use("/movies", moviesRoutes);

  

  const port = process.env.PORT || 8000;

  app.listen(port, () => console.log(`Listening on port ${port}!`));
};

main();