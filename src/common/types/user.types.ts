import { User } from "../../generated/prisma/client.js";

export interface GetAllUsersResponse {
  users: User[];
  total: number;
  totalPages: number;
}

export interface GetUserResponse {
  user: User;
}

export interface CreateUserResponse {
    message: string;
}

export interface UpdateUserResponse {
    message: string;
}

export interface DeleteUserResponse {
    message: string;
}