import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import User from '../models/User';
import { AppError, StatusCode } from '../utils/AppError';

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find().select('-password').lean();

  if (!users?.length) {
    throw new AppError('No users found', StatusCode.NotFound);
  }

  res.json(users);
};

export const createNewUser = async (req: Request, res: Response) => {
  const { username, password, roles } = req.body;

  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    throw new AppError('Missing required fields', StatusCode.BadRequest);
  }

  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate) {
    throw new AppError('User already exists', StatusCode.Conflict);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    password: hashedPassword,
    roles,
  });

  if (user) {
    res
      .status(StatusCode.Created)
      .json({ message: `User ${user.username} created` });
  } else {
    res.status(StatusCode.BadRequest).json({ message: 'Invalid user data' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id, username, password, roles } = req.body;

  if (!id || !username || !Array.isArray(roles) || !roles.length) {
    throw new AppError('Missing required fields', StatusCode.BadRequest);
  }

  const user = await User.findById(id).exec();

  if (!user) {
    throw new AppError('User not found', StatusCode.NotFound);
  }

  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate && duplicate._id.toString() !== id) {
    throw new AppError('User already exists', StatusCode.Conflict);
  }

  user.username = username;
  user.roles = roles;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.json({ message: `User ${updatedUser.username} updated` });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    throw new AppError('Missing required fields', StatusCode.BadRequest);
  }

  const user = await User.findById(id).exec();

  if (!user) {
    throw new AppError('User not found', StatusCode.NotFound);
  }

  const result = await user.deleteOne();

  res.json({ message: `User ${result.username} deleted` });
};
