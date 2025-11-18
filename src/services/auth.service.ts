import { LoginDto } from '../common/dto/auth.dto.js';
import { ApiError } from '../common/errors/api.error.js';
import { LoginResponse } from '../common/types/auth.types.js';
import { User } from '../generated/prisma/client.js';
import userService from './user.service.js';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthService {

  private generateAccessToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
    };
    
    return jwt.sign(
      payload, 
      process.env.JWT_AT_SECRET!, 
      { expiresIn: '1h' } 
    );
  }

  public async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    const isUser = await userService.getUserByEmail(email);
    if (!isUser) throw ApiError.NotFound('Invalid email or password');

    if(!isUser.isAdmin) throw ApiError.Forbidden('Only admins can log in');
    if (!isUser.password) throw ApiError.BadRequest('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(password, isUser.password);
    if (!isPasswordValid) throw ApiError.BadRequest('Invalid email or password');

    const accessToken = this.generateAccessToken(isUser);

    return { accessToken, message: 'Successful login' };
  }
}

export default new AuthService();