import { Request, Response } from 'express';
import UserDoneWorkout from '../models/UserDoneWorkout';
import { AppError, StatusCode } from '../utils/AppError';
import getCurrentUser from '../utils/getCurrentUser';

export const getAllUserDoneWorkouts = async (req: Request, res: Response) => {
  const currentUser = await getCurrentUser(req);

  const doneWorkouts = await UserDoneWorkout.find({ user: currentUser._id })
    .populate('workout')
    .lean();

  if (!doneWorkouts?.length) {
    throw new AppError('No workout history found', StatusCode.NotFound);
  }

  res.json(doneWorkouts);
};

export const createUserDoneWorkout = async (req: Request, res: Response) => {
  const currentUser = await getCurrentUser(req);

  const { userWorkout, workout } = req.body;

  const doneWorkout = await UserDoneWorkout.create({
    user: currentUser._id,
    userWorkout,
    workout,
  });

  if (doneWorkout) {
    res.status(StatusCode.Created).json({ message: 'Done workout created' });
  } else {
    throw new AppError('Invalid done workout data', StatusCode.BadRequest);
  }
};

export const deleteUserDoneWorkout = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    throw new AppError('Missing required fields', StatusCode.BadRequest);
  }

  const doneWorkout = await UserDoneWorkout.findById(id).exec();

  if (!doneWorkout) {
    throw new AppError('Done Workout not found', StatusCode.NotFound);
  }

  await doneWorkout.deleteOne();
  res.json({ message: `User workout ${doneWorkout.id} deleted` });
};

export const getCurrentWorkoutHistory = async (req: Request, res: Response) => {
  const currentUser = await getCurrentUser(req);
  const { id } = req.params;

  if (!id) {
    throw new AppError('Missing required fields', StatusCode.BadRequest);
  }

  const doneWorkouts = await UserDoneWorkout.find({
    user: currentUser._id,
    userWorkout: id,
  })
    .populate('workout')
    .lean();

  if (!doneWorkouts?.length) {
    throw new AppError('No workout history found', StatusCode.NotFound);
  }

  res.json(doneWorkouts);
};
