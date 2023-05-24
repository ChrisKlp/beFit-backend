/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextFunction, Request, Response } from 'express';
import { StatusCode } from '../utils/AppError';

const verifyIsAdmin = (req: Request, res: Response, next: NextFunction) => {
  if ('role' in req && req.role !== 'admin') {
    res.status(StatusCode.Forbidden).json({ message: 'Forbidden' });
    return;
  }

  next();
};

export default verifyIsAdmin;
