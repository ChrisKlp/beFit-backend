import { Request } from 'express';
import User from '../models/User';
import { AppError, StatusCode } from './AppError';

const getCurrentUser = async (req: Request) => {
  const { user } = req as Request & { user: string };

  const currentUser = await User.findOne({ username: user }).lean().exec();

  if (!currentUser) {
    throw new AppError('Unauthorized', StatusCode.Unauthorized);
  }

  return currentUser;
};

export default getCurrentUser;
