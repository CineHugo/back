/* eslint-disable no-unused-vars */
import { Movie } from "../../../models/movie";
import { badRequest, ok, serverError } from "../../helpers";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { IDeleteMovieRepository } from "./protocols";

export class DeleteMovieController implements IController {
  constructor(private readonly deleteMovieRepository: IDeleteMovieRepository) {}
  async handle(
    httpRequest: HttpRequest<any>
  ): Promise<HttpResponse<Movie | string>> {
    try {
      const id = httpRequest?.params?.id;

      if (!id) {
        return badRequest("Missing movie id");
      }

      const movie = await this.deleteMovieRepository.deleteMovie(id);

      if (!movie) {
        return badRequest("Movie not found");
      }

      return ok<Movie>(movie);
    } catch (error) {
      return serverError();
    }
  }
}
