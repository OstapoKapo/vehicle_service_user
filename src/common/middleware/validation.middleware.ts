import { Request, Response, NextFunction, RequestHandler } from 'express';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { ApiError } from '../errors/api.error.js';

type Constructor<T> = { new (...args: any[]): T };

export const validateDto = (dtoClass: Constructor<any>): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObj = plainToClass(dtoClass, req.body);

    const errors: ValidationError[] = await validate(dtoObj);

    if (errors.length > 0) {
   
      const formattedErrors = errors.map(error => ({
        property: error.property,
        constraints: error.constraints
      }));

      next(ApiError.BadRequest('Validation error', formattedErrors));
      return; 
    }

    req.body = dtoObj;
    
    next();
  };
};