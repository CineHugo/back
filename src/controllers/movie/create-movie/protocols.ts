/* eslint-disable no-unused-vars */
import { Movie } from "../../../models/movie";

export interface CreateMovieParams {
  title: string;
  synopsis: string;
  releaseDate: Date;
  mainImageUrl: string;
  bannerImageUrl: string;
}

export interface ICreateMovieRepository {
  createMovie(params: CreateMovieParams): Promise<Movie>;
}
