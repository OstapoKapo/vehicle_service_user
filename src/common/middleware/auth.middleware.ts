// /src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: string | jwt.JwtPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Немає токена або невірний формат' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Токен не надано' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);

 
    req.user = payload;

    next();

  } catch (error) {
    return res.status(401).json({ message: 'Невалідний токен' });
  }
};