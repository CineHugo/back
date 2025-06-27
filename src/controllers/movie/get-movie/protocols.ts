/* eslint-disable no-unused-vars */
import { Movie } from "../../../models/movie";

export interface IGetMovieRepository {
    getMovie: (id: string) => Promise<Movie | null>;
}