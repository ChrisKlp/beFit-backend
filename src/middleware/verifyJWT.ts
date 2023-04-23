/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextFunction, Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { config } from 'dotenv';

config();

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = (req.headers.authorization ||
    req.headers.Authorization) as string | undefined;

  if (!authHeader?.startsWith('Bearer')) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as Secret,
    (err, decoded) => {
      if (err) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      // @ts-ignore
      req.user = decoded.UserInfo.username;
      // @ts-ignore
      req.roles = decoded.UserInfo.roles;
      next();
    }
  );
};

export default verifyJWT;
