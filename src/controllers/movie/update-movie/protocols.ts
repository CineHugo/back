import { Movie } from "../../../models/movie";

/* eslint-disable no-unused-vars */
export interface UpdateMovieParams {
  title?: string;
  synopsis?: string;
  release_date?: Date;
  main_image_url?: string;
  banner_image_url?: string;
}


export interface IUpdateMovieRepository {
    updateMovie: (id: string, params: UpdateMovieParams) => Promise<Movie>;
}