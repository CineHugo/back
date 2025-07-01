/* eslint-disable no-unused-vars */
import { Movie } from "../../../models/movie";
import { Base64Image, ImageStorageService } from "../../../services/image-storage-service";
import { badRequest, ok, serverError } from "../../helpers";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { IUpdateMovieRepository, UpdateMovieParams } from "./protocols";

// Estende temporariamente os campos que podem vir no body
interface UpdateMovieRequest
  extends Omit<UpdateMovieParams, "mainImageUrl" | "bannerImageUrl"> {
  mainImageUrl?: Base64Image;
  bannerImageUrl?: Base64Image;
}

export class UpdateMovieController implements IController {
  constructor(private readonly updateMovieRepository: IUpdateMovieRepository) {}

  async handle(
    httpRequest: HttpRequest<UpdateMovieRequest>
  ): Promise<HttpResponse<Movie | string>> {
    try {
      const id = httpRequest?.params?.id;
      const { title, synopsis, releaseDate, mainImageUrl, bannerImageUrl, ...rest } = httpRequest?.body || {};

      if (!id) return badRequest("Missing movie id");

      const bodyToUpdate: UpdateMovieParams = {
        ...rest,
      };

      if (title) bodyToUpdate.title = title;
      if (synopsis) bodyToUpdate.synopsis = synopsis;
      if (releaseDate) bodyToUpdate.releaseDate = releaseDate;

      // Processar imagens base64, se enviadas
      if (mainImageUrl) {
        bodyToUpdate.mainImageUrl = await ImageStorageService.save(mainImageUrl);
      }
      if (bannerImageUrl) {
        bodyToUpdate.bannerImageUrl = await ImageStorageService.save(bannerImageUrl);
      }

      const allowedFieldsToUpdate: (keyof UpdateMovieParams)[] = [
        "title",
        "synopsis",
        "releaseDate",
        "mainImageUrl",
        "bannerImageUrl",
      ];

      const someFieldsAreNotAllowedToUpdate = Object.keys(bodyToUpdate).some(
        (key) => !allowedFieldsToUpdate.includes(key as keyof UpdateMovieParams)
      );

      if (someFieldsAreNotAllowedToUpdate) {
        return badRequest("Some fields are not allowed to be updated");
      }

      const movie = await this.updateMovieRepository.updateMovie(id, bodyToUpdate);

      if (!movie) {
        return badRequest("Movie not found or no fields to update");
      }

      return ok<Movie>(movie);
    } catch (error) {
      console.error("Erro no UpdateMovieController:", error);
      return serverError();
    }
  }
}
