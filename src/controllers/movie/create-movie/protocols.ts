/* eslint-disable no-unused-vars */
import { Movie } from "../../../models/movie";

export interface CreateMovieParams {
  title: string;
  synopsis: string;
  release_date: Date;
  main_image_url: string;
  banner_image_url: string;
}

export interface ICreateMovieRepository {
  createMovie(params: CreateMovieParams): Promise<Movie>;
}
