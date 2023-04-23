import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import User from '../models/User';

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').lean();

  if (!users?.length) {
    res.status(400).json({ message: 'No users found' });
    return;
  }

  res.json(users);
});

export const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate) {
    res.status(409).json({ message: 'User already exists' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    password: hashedPassword,
    roles,
  });

  if (user) {
    res.status(201).json({ message: `User ${user.username} created` });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id, username, password, roles } = req.body;

  if (!id || !username || !Array.isArray(roles) || !roles.length) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const user = await User.findById(id).exec();

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate && duplicate._id.toString() !== id) {
    res.status(409).json({ message: 'User already exists' });
    return;
  }

  user.username = username;
  user.roles = roles;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.json({ message: `User ${updatedUser.username} updated` });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const user = await User.findById(id).exec();

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const result = await user.deleteOne();

  res.json({ message: `User ${result.username} deleted` });
});
