import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { LoginDto, SignupDto } from '../common/dto/auth.dto.js';
import { validate } from 'class-validator';
import authService from '../services/auth.service.js';
import { LoginResponse, SignupResponse } from '../common/types/auth.types.js';
import userService from '../services/user.service.js';

export const login = async (req: Request, res: Response): Promise<LoginResponse | Response> => {
    try{
    console.log('Received login request:', req.body);
    const body = req.body;
    const loginDto = plainToClass(LoginDto, body);

    const errors = await validate(loginDto);
    if (errors.length > 0) {
        return res.status(400).json({ 
            message: 'Помилка валідації', 
            errors 
        });
    }
    
    try{
        const loginRequest = await authService.login(loginDto);
        res.cookie('accessToken', loginRequest.accessToken, {
          httpOnly: true,
          secure: 'production' === process.env.NODE_ENV,
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60, // 1 година
        });
        return res.status(200).json(loginRequest);
    }catch(err){
        if (err instanceof Error) {
            if (err.message === 'Користувача не знайдено' || err.message === 'Невірний пароль') {
                return res.status(401).json({ message: err.message });
            }
        }
        console.error('Error during login:', err);
        return res.status(500).json({ message: 'Внутрішня помилка сервера' });
    }
}catch(err){
    console.error('Error processing login request:', err);
    return res.status(500).json({ message: 'Внутрішня помилка сервера' });
}
 };

export const signup = async (req: Request, res: Response): Promise<SignupResponse | Response> => {
    const body = req.body;
    const signupDto = plainToClass(SignupDto, body);

    const errors = await validate(signupDto);
    if (errors.length > 0) {
        console.log('Validation errors:', errors);
        return res.status(400).json({ 
            message: 'Помилка валідації', 
            errors 
        });
    }

    try{
        const {message} = await authService.signup(signupDto);
        return res.status(201).json({ message });
    }catch(err) {
        if (err instanceof Error) {
            if (err.message === 'Користувач з таким email вже існує' || err.message === 'Паролі не збігаються') {
                return res.status(400).json({ message: err.message }); // 400 Bad Request
            }
        }
        return res.status(500).json({ message: 'Внутрішня помилка сервера' });
    }
};

export const me = async (req: Request, res: Response): Promise<Response> => {
    if (!req.user) {
        return res.status(401).json({ message: 'Користувач не автентифікований' });
    }

    const user = await userService.getUserById((req.user as any).id);
    if (!user) {
        return res.status(404).json({ message: 'Користувача не знайдено' });
    }

    return res.status(200).json({ user });
}

export default {
    login,
    signup,
    me
}