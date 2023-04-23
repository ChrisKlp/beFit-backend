import bcrypt from 'bcrypt';
import { config } from 'dotenv';
import asyncHandler from 'express-async-handler';
import jwt, { Secret } from 'jsonwebtoken';
import User from '../models/User';

config();

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser) {
    res.status(404).json({ message: 'Unauthorized' });
    return;
  }

  const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);

  if (!isPasswordCorrect) {
    res.status(401).json({ message: 'Unauthorized' });
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
    secure: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.json({ accessToken });
});

export const refresh = asyncHandler(async (req, res) => {
  const { cookies } = req;

  if (!cookies?.jwt) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const refreshToken = cookies.jwt as string;

  const decoded = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as Secret
  ) as { username: string };

  if (!decoded) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  const foundUser = await User.findOne({ username: decoded.username }).exec();

  if (!foundUser) {
    res.status(404).json({ message: 'Unauthorized' });
    return;
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
});

export const logout = asyncHandler(async (req, res) => {
  const { cookies } = req;

  if (!cookies?.jwt) {
    res.sendStatus(204);
    return;
  }

  res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'none' });
  res.json({ message: 'Logged out' });
});
