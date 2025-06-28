import { Movie } from "../../../models/movie";

/* eslint-disable no-unused-vars */
export interface UpdateMovieParams {
  title?: string;
  synopsis?: string;
  releaseDate?: Date;
  mainImageUrl?: string;
  bannerImageUrl?: string;
}

export interface IUpdateMovieRepository {
  updateMovie: (id: string, params: UpdateMovieParams) => Promise<Movie>;
}
