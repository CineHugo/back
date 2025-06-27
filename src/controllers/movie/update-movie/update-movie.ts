/* eslint-disable no-unused-vars */
import { Movie } from "../../../models/movie";
import { badRequest, ok, serverError } from "../../helpers";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { IUpdateMovieRepository, UpdateMovieParams } from "./protocols";

export class UpdateMovieController implements IController{
    constructor(private readonly updateMovieRepository: IUpdateMovieRepository) {}

    async handle(httpRequest: HttpRequest<UpdateMovieParams>): Promise<HttpResponse<Movie | string>> {

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
                "release_date",
                "main_image_url",
                "banner_image_url"
            ];

            const someFieldsAreNotAllowedToUpdate = Object.keys(body).some(
                (key) => !allowedFieldsToUpdate.includes(key as keyof UpdateMovieParams)
            );

            if (someFieldsAreNotAllowedToUpdate) {
                return badRequest("Some fields are not allowed to be updated");
            }

            const movie = await this.updateMovieRepository.updateMovie(id, body);

            return ok<Movie>(movie);
        } catch (error) {
            return serverError();
        }
    }
}