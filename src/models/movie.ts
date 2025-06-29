import { ObjectId } from "mongodb";

export interface Movie {
  id: ObjectId;
  title: string;
  synopsis: string;
  releaseDate: Date;
  mainImageUrl: string;
  bannerImageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
