import { Request, Response } from 'express';
import authService from '../services/auth.service.js';
import { LoginResponse, LogoutResponse } from '../common/types/auth.types.js';
import userService from '../services/user.service.js';
import { ApiError } from '../common/errors/api.error.js';

export const login = async (req: Request, res: Response<LoginResponse>): Promise<Response> => {
    const response = await authService.login(req.body);

    res.cookie('accessToken', response.accessToken, {
        httpOnly: true,
        secure: 'production' === process.env.NODE_ENV,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60, // 1 година
    });
    return res.status(200).json(response);
};


export const logout = async (req: Request, res: Response<LogoutResponse>): Promise<Response> => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: 'production' === process.env.NODE_ENV,
        sameSite: 'strict',
        path: '/'
    });
    return res.status(200).json({ message: 'Successfully logged out' });
}

export default {
    login,
    logout
}