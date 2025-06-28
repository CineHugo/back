import { ObjectId } from "mongodb";


export interface Seat {
  label: string;
  row: string;
  col: number;
}


export interface Room {
  _id: ObjectId;
  name: string;
  capacity: number;
  seatMap: Seat[]; // Armazenado como um array de objetos, não como string
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
