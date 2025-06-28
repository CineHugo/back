/* eslint-disable no-unused-vars */
import { Movie } from "../../../models/movie";
import { badRequest, ok, serverError } from "../../helpers";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { IUpdateMovieRepository, UpdateMovieParams } from "./protocols";

export class UpdateMovieController implements IController {
  constructor(private readonly updateMovieRepository: IUpdateMovieRepository) {}

  async handle(
    httpRequest: HttpRequest<UpdateMovieParams>
  ): Promise<HttpResponse<Movie | string>> {
    try {
      const id = httpRequest?.params?.id;
      const body = httpRequest?.body;
      if (!body) {
        return badRequest("Body missing fields");
      }

      if (!id) {
        return badRequest("Missing movie id");
      }

      const allowedFieldsToUpdate: (keyof UpdateMovieParams)[] = [
        "title",
        "synopsis",
        "releaseDate",
        "mainImageUrl",
        "bannerImageUrl",
      ];

      const someFieldsAreNotAllowedToUpdate = Object.keys(body).some(
        (key) => !allowedFieldsToUpdate.includes(key as keyof UpdateMovieParams)
      );

      if (someFieldsAreNotAllowedToUpdate) {
        return badRequest("Some fields are not allowed to be updated");
      }

      const movie = await this.updateMovieRepository.updateMovie(id, body);

      if (!movie) {
        return badRequest("Movie not found or no fields to update");
      }

      return ok<Movie>(movie);
    } catch (error) {
      return serverError();
    }
  }
}
