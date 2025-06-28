/* eslint-disable no-unused-vars */

import { ObjectId } from "mongodb";

export enum Status {
    ACTIVE = "active",
    USED = "used",
    CANCELLED = "cancelled",
  }


export interface Ticket {
  _id: ObjectId;
  sessionId: ObjectId;
  userId: ObjectId;
  seatLabel: string;
  occupantName: string;
  occupantEmail: string;
  occupantCpf: string;
  qrUuid: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
