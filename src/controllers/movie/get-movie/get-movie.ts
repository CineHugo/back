/* eslint-disable no-unused-vars */
import { Movie } from "../../../models/movie";
import { badRequest, ok, serverError } from "../../helpers";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { IGetMovieRepository } from "./protocols";

export class GetMovieController implements IController {
  constructor(private readonly getMovieRepository: IGetMovieRepository) {}
  async handle(
    httpRequest: HttpRequest<unknown>
  ): Promise<HttpResponse<unknown>> {
    try {
      const id = httpRequest?.params?.id;

      if (!id) {
        return badRequest("Missing movie id");
      }

      const movie = await this.getMovieRepository.getMovie(id);

      return ok<Movie>(movie);
    } catch (error) {
      return serverError();
    }
  }
}
