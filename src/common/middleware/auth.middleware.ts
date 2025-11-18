import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: 'Неавторизовано: Куки не знайдено' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_AT_SECRET!);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Невалідний токен' });
  }
};