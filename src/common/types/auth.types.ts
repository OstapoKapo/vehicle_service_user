import { User } from '../../generated/prisma/client.js';
export interface LoginResponse {
  accessToken: string;
  message: string;
}

export interface LogoutResponse {
  message: string;
}
