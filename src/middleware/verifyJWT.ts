/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextFunction, Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { config } from 'dotenv';

export interface CustomRequest extends Request {
  user: string;
  roles: string[];
}

config();

const verifyJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
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

      const { UserInfo } = decoded as {
        UserInfo: { username: string; roles: string[] };
      };

      req.user = UserInfo.username;
      req.roles = UserInfo.roles;
      next();
    }
  );
};

export default verifyJWT;
