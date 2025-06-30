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
  // A promessa agora inclui a possibilidade de retornar 'null', caso o filme não seja encontrado
  updateMovie(id: string, params: UpdateMovieParams): Promise<Movie | null>;
}
