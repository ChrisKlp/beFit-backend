/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { NextFunction, Request, Response } from 'express';
import errorHandler from '../utils/ErrorHandler';

const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  errorHandler.handleError(err, res);
};

export default errorMiddleware;
