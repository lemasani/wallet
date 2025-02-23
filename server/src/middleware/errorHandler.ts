import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error
  let customError = {
    statusCode: 500,
    message: 'Something went wrong',
    errors: [] as { field: string; message: string; }[]
  };

  // Zod Validation Errors
  if (err instanceof ZodError) {
    customError.statusCode = 400;
    customError.message = 'Validation Error';
    customError.errors = err.errors.map(error => ({
      field: error.path.join('.'),
      message: error.message
    }));
  }

  // Prisma Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      customError.statusCode = 409;
      customError.message = 'Duplicate field value entered';
    }
  }

  // Custom AppError
  if (err instanceof AppError) {
    customError.statusCode = err.statusCode;
    customError.message = err.message;
  }

  // Send API Response
  return res.status(customError.statusCode).json({
    success: false,
    message: customError.message,
    errors: customError.errors.length ? customError.errors : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};