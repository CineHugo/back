/* eslint-disable no-unused-vars */
import { Movie } from "../../../models/movie";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { CreateMovieParams, ICreateMovieRepository } from "./protocols";
import { badRequest, created, serverError } from "../../helpers";
import {
  ImageStorageService,
  Base64Image,
} from "../../../services/image-storage-service";

interface CreateMovieRequest
  extends Omit<CreateMovieParams, "main_image_url" | "banner_image_url"> {
  main_image: Base64Image;
  banner_image: Base64Image;
}

export class CreateMovieController implements IController {
  constructor(private readonly createMovieRepository: ICreateMovieRepository) {}

  async handle(
    httpRequest: HttpRequest<CreateMovieRequest>
  ): Promise<HttpResponse<Movie | string>> {
    try {
      const { title, synopsis, release_date, main_image, banner_image } =
        httpRequest.body!;

      if (!title || !synopsis || !release_date) {
        return badRequest(
          "Fields title, synopsis, and release_date are required."
        );
      }
      if (!main_image?.data || !banner_image?.data) {
        return badRequest(
          "Fields main_image and banner_image are required with base64 data."
        );
      }

      // Salva as imagens em paralelo usando o serviço
      const [mainImageUrl, bannerImageUrl] = await Promise.all([
        ImageStorageService.save(main_image),
        ImageStorageService.save(banner_image),
      ]);

      //  Monta o objeto final para o repositório
      const movieDataToCreate: CreateMovieParams = {
        title,
        synopsis,
        release_date,
        main_image_url: mainImageUrl,
        banner_image_url: bannerImageUrl,
      };

      const movie = await this.createMovieRepository.createMovie(movieDataToCreate);

      return created<Movie>(movie);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
