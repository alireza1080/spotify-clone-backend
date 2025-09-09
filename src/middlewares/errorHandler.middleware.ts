import { Request, Response } from 'express';
import { config } from 'dotenv';

config();

const isDev = process.env.NODE_ENV === 'development';

type AppError = {
  err: Error;
  field: string;
};

const errorHandler = (
  error: AppError,
  _req: Request,
  res: Response
): Response => {
  if (isDev) {
    console.error(`Error in ${error.field}:`, error.err);
  }
  return res.status(500).json({
    message: isDev ? error.err.message : 'Internal server error',
    success: false,
  });
};

export { errorHandler };
