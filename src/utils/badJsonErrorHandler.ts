import { NextFunction, Request, Response } from 'express';

const badJsonErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res
      .status(400)
      .json({ message: 'Bad JSON format in request body', success: false });
  }
  next();
};

export { badJsonErrorHandler };
