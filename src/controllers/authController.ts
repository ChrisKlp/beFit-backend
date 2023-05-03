import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../models/User';
import { AppError, StatusCode } from '../utils/AppError';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new AppError('Missing required fields', StatusCode.BadRequest);
  }

  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser) {
    throw new AppError('Unauthorized', StatusCode.Unauthorized);
  }

  const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);

  if (!isPasswordCorrect) {
    throw new AppError('Unauthorized', StatusCode.Unauthorized);
  }

  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        roles: foundUser.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET as Secret,
    {
      expiresIn: '1h',
    }
  );

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET as Secret,
    {
      expiresIn: '7d',
    }
  );

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.json({ accessToken });
};

export const refresh = async (req: Request, res: Response) => {
  const { cookies } = req;

  if (!cookies?.jwt) {
    throw new AppError('Unauthorized', StatusCode.Unauthorized);
  }

  const refreshToken = cookies.jwt as string;

  const decoded = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as Secret
  ) as { username: string };

  if (!decoded) {
    throw new AppError('Forbidden', StatusCode.Forbidden);
  }

  const foundUser = await User.findOne({ username: decoded.username }).exec();

  if (!foundUser) {
    throw new AppError('Unauthorized', StatusCode.Unauthorized);
  }

  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        roles: foundUser.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET as Secret,
    {
      expiresIn: '1h',
    }
  );

  res.json({ accessToken });
};

export const logout = async (req: Request, res: Response) => {
  const { cookies } = req;

  if (!cookies?.jwt) {
    res.sendStatus(StatusCode.NoContent);
    return;
  }

  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
  });
  res.json({ message: 'Logged out' });
};
