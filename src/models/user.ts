/* eslint-disable no-unused-vars */
export enum Role {
    USER = "user",
    ADMIN = "admin",
  }
  
  export interface User {
    id: number;
    firstName: string;
    lastName: string;
    role: Role;
    email: string;
    password: string;
    rememberToken: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }
  