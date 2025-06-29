import { Movie } from "../../../models/movie";

export interface IGetMoviesRepository {
  getMovies: () => Promise<Movie[]>;
}
