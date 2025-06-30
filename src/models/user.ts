import { ObjectId } from "mongodb";

/* eslint-disable no-unused-vars */
export enum Role {
    USER = "user",
    ADMIN = "admin",
  }
  
  export interface User {
    _id: ObjectId;
    firstName: string;
    lastName: string;
    role: Role;
    email: string;
    password?: string;
    rememberToken: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }
  