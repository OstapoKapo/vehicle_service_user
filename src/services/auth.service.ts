import { LoginDto, SignupDto } from '../common/dto/auth.dto.js';
import { LoginResponse, SignupResponse } from '../common/types/auth.types.js';
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
    if (!isUser) {
      throw new Error('Користувача не знайдено');
    }

    const isPasswordValid = await bcrypt.compare(password, isUser.password);
    if (!isPasswordValid) {
      throw new Error('Невірний пароль');
    }

    const accessToken = this.generateAccessToken(isUser);

    return { accessToken, message: 'Успішний вхід' };
  }

  public async signup(signupDto: SignupDto): Promise<SignupResponse> {
    const { email, password, firstName, lastName, confirmPassword } = signupDto;

    if (password !== confirmPassword) {
      throw new Error('Паролі не збігаються');
    }

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      throw new Error('Користувач з таким email вже існує');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userService.createUser({...signupDto, password: hashedPassword });
    
    return { message: `Користувача з email: ${email} успішно створено` };
  }
}

export default new AuthService();