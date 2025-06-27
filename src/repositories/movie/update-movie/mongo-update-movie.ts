import { ObjectId } from "mongodb";
import { MongoClient } from "../../../database/mongo";
import { IUpdateMovieRepository, UpdateMovieParams } from "../../../controllers/movie/update-movie/protocols";
import { MongoMovie } from "../../mongo-protocols";
import { Movie } from "../../../models/movie";

export class MongoUpdateMovieRepository implements IUpdateMovieRepository {
    async updateMovie(id: string, params: UpdateMovieParams): Promise<Movie> {  
        await MongoClient.db.collection<MongoMovie>("movies").updateOne(
            { _id: new ObjectId(id) },
            { $set: {...params,} });

            const movie = await MongoClient.db
            .collection<MongoMovie>("movies")
            .findOne({ _id: new ObjectId(id) });

        if (!movie) {
            throw new Error("Movie not found");
        }

        const { _id, ...rest } = movie;

        return { id: _id, ...rest };
    }
}