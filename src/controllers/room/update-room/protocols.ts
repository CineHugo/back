/* eslint-disable no-unused-vars */
import { Room, Seat } from "../../../models/room";

export interface UpdateRoomParams {
    name?: string;
    seatMap?: Seat[]; 
}

export interface IUpdateRoomRepository {
    updateRoom: (id: string, params: UpdateRoomParams) => Promise<Room>;
}