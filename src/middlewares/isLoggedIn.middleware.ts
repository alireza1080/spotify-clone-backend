import { NextFunction, Request, Response } from 'express';

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req?.auth?.userId) {
      return res.status(401).json({
        message: 'Unauthorized - You must be logged in to access this resource',
        success: false,
      });
    }
    next();
  } catch (error) {
    next({ err: error, field: 'isLoggedIn' });
  }
};

export { isLoggedIn };
