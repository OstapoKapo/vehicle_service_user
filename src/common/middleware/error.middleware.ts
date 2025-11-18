import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/api.error.js';

export const errorMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(err); 

    if (err instanceof ApiError) {
        return res.status(err.status).json({ 
            message: err.message, 
            errors: err.errors 
        });
    }

    return res.status(500).json({ message: 'Internal server error' });
};