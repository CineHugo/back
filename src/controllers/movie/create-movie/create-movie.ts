/* eslint-disable no-unused-vars */
import validator from "validator";
import { Movie } from "../../../models/movie";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { CreateMovieParams, ICreateMovieRepository } from "./protocols";
import { badRequest, created, serverError } from "../../helpers";

export class CreateMovieController implements IController {
    constructor(private readonly createMovieRepository: ICreateMovieRepository) {}

        async handle( httpRequest: HttpRequest<CreateMovieParams>
    ): Promise<HttpResponse<Movie | string>> {
        try {
            // Verificar campos obrigatórios
            const requiredFields = [
                "title",
                "synopsis",
                "release_date",
                "main_image_url",
                "banner_image_url"
            ];

            for (const field of requiredFields) {
                const value = httpRequest?.body?.[field as keyof CreateMovieParams];
                if (
                    value === undefined ||
                    value === null ||
                    (typeof value === "string" && value.length === 0)
                ) {
                    return badRequest(`Field ${field} is required`);
                }
            }

            const movie = await this.createMovieRepository.createMovie(
                httpRequest.body!
            );

            return created<Movie>(movie);
        } catch (error) {
            return serverError();
        }
    }
}