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
  extends Omit<CreateMovieParams, "mainImageUrl" | "bannerImageUrl"> {
  mainImage: Base64Image;
  bannerImage: Base64Image;
}

export class CreateMovieController implements IController {
  constructor(private readonly createMovieRepository: ICreateMovieRepository) {}

  async handle(
    httpRequest: HttpRequest<CreateMovieRequest>
  ): Promise<HttpResponse<Movie | string>> {
    try {
      const { title, synopsis, releaseDate, mainImage, bannerImage } =
        httpRequest.body!;

      if (!title || !synopsis || !releaseDate) {
        return badRequest(
          "Fields title, synopsis, and releaseDate are required."
        );
      }
      if (!mainImage?.data || !bannerImage?.data) {
        console.log(
          "Fields mainImage and bannerImage are required with base64 data."
        );
      }

      // Salva as imagens em paralelo usando o serviço
      const [mainImageUrl, bannerImageUrl] = await Promise.all([
        ImageStorageService.save(mainImage),
        ImageStorageService.save(bannerImage),
      ]);

      // Monta o objeto final para o repositório
      const movieDataToCreate: CreateMovieParams = {
        title,
        synopsis,
        releaseDate,
        mainImageUrl: mainImageUrl,
        bannerImageUrl: bannerImageUrl,
      };

      const movie =
        await this.createMovieRepository.createMovie(movieDataToCreate);

      return created<Movie>(movie);
    } catch (error) {
      console.error("Error during movie creation:", error);

      // Verifica o tipo de erro e ajusta a resposta
      if (error instanceof Error) {
        return serverError(error.message); // Retorna o erro específico caso seja uma instância de Error
      }

      // Se for um erro desconhecido, retorna uma mensagem genérica
      return serverError("Something went wrong while processing your request.");
    }
  }
}
