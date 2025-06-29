/* eslint-disable no-unused-vars */
import { HttpResponse, IController } from "../../protocols";
import { IGetMoviesRepository } from "./protocols";
import { serverError, ok } from "../../helpers";
import { Movie } from "../../../models/movie";

export class GetMoviesController implements IController{
    constructor(private readonly getMoviesRepository: IGetMoviesRepository) {}
    async handle(): Promise<HttpResponse<Movie[] | string>> {
        try {
            // Validar a requisição
            // direcionar chamada para o repository
            const movies = await this.getMoviesRepository.getMovies();

            return ok<Movie[]>(movies);
        } catch (error) {
            // tratar a exceção
            return serverError();
        }
    }
}