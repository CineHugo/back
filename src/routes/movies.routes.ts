import { Router } from "express";
import { MongoGetMoviesRepository } from "../repositories/movie/get-movies/mongo-get-movies";
import { GetMoviesController } from "../controllers/movie/get-movies/get-movies";
import { MongoGetMovieRepository } from "../repositories/movie/get-movie/mongo-get-movie";
import { GetMovieController } from "../controllers/movie/get-movie/get-movie";
import { MongoCreateMovieRepository } from "../repositories/movie/create-movie/mongo-create-movie";
import { CreateMovieController } from "../controllers/movie/create-movie/create-movie";
import { MongoUpdateMovieRepository } from "../repositories/movie/update-movie/mongo-update-movie";
import { UpdateMovieController } from "../controllers/movie/update-movie/update-movie";
import { MongoDeleteMovieRepository } from "../repositories/movie/delete-movie/mongo-delete-movie";
import { DeleteMovieController } from "../controllers/movie/delete-movie/delete-movie";

const moviesRoutes = Router();

// Rota para listar todos os filmes
moviesRoutes.get("/", async (req, res) => {
    const mongoGetMoviesRepository = new MongoGetMoviesRepository();

    const getMoviesController = new GetMoviesController(mongoGetMoviesRepository);

    const { body, statusCode } = await getMoviesController.handle();

    res.status(statusCode).send(body);
});

// Rota para buscar um filme específico pelo ID
moviesRoutes.get("/movie/:id", async (req, res) => {
    const mongoGetMovieRepository = new MongoGetMovieRepository();

    const getMovieController = new GetMovieController(mongoGetMovieRepository);

    const { body, statusCode } = await getMovieController.handle({
        body: req.body,
        params: req.params,
    });

    res.status(statusCode).send(body);
});

// Rota para criar um novo filme
moviesRoutes.post("/create", async (req, res) => {
    const mongoCreateMovieRepository = new MongoCreateMovieRepository();

    const createMovieController = new CreateMovieController(mongoCreateMovieRepository);

    const { body, statusCode } = await createMovieController.handle({
        body: req.body,
    });

    res.status(statusCode).send(body);
});

// Rota para atualizar um filme
moviesRoutes.patch("/update/:id", async (req, res) => {
    const mongoUpdateMovieRepository = new MongoUpdateMovieRepository();

    const updateMovieController = new UpdateMovieController(mongoUpdateMovieRepository);

    const { body, statusCode } = await updateMovieController.handle({
        body: req.body,
        params: req.params,
    });

    res.status(statusCode).send(body);
});

// Rota para deletar um filme
moviesRoutes.delete("/delete/:id", async (req, res) => {
    const mongoDeleteMovieRepository = new MongoDeleteMovieRepository();

    const deleteMovieController = new DeleteMovieController(mongoDeleteMovieRepository);

    const { body, statusCode } = await deleteMovieController.handle({
        params: req.params,
    });

    res.status(statusCode).send(body);
});

export default moviesRoutes;