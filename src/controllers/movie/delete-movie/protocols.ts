/* eslint-disable no-unused-vars */
import { Movie } from "../../../models/movie";

export interface IDeleteMovieRepository {
    deleteMovie(id: string): Promise<Movie>;
}