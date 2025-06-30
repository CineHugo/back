/* eslint-disable no-unused-vars */

import { ObjectId } from "mongodb";
import { User } from "./user";
import { PopulatedSession } from "./session";

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

// Como o Ticket fica DEPOIS de ser populado pelo repositório
export interface PopulatedTicket extends Omit<Ticket, "userId" | "sessionId"> {
  user?: Partial<User>; // Use Partial<User> para não expor a senha
  session?: PopulatedSession;
}
