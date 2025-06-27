import { ObjectId } from "mongodb";

export interface Session {
    id: ObjectId;
    movie_id: ObjectId;
    room_id: ObjectId;
    starts_at: Date;
    ends_at: Date;
    duration_min: number;
    base_price: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
