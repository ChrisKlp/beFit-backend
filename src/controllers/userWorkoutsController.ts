import { Request, Response } from 'express';
import UserWorkout from '../models/UserWorkout';
import { AppError, StatusCode } from '../utils/AppError';
import getCurrentUser from '../utils/getCurrentUser';

export const getAllUserWorkouts = async (req: Request, res: Response) => {
  const currentUser = await getCurrentUser(req);

  const workouts = await UserWorkout.find({ user: currentUser._id })
    .populate([
      {
        path: 'workoutA',
        model: 'Workout',
        populate: {
          path: 'exercises.exercise',
          model: 'Exercise',
        },
      },
      {
        path: 'workoutB',
        model: 'Workout',
        populate: {
          path: 'exercises.exercise',
          model: 'Exercise',
        },
      },
      {
        path: 'workoutC',
        model: 'Workout',
        populate: {
          path: 'exercises.exercise',
          model: 'Exercise',
        },
      },
    ])
    .lean();

  if (!workouts?.length) {
    throw new AppError('No workouts found', StatusCode.NotFound);
  }

  res.json(workouts);
};

export const createUserWorkout = async (req: Request, res: Response) => {
  const currentUser = await getCurrentUser(req);

  const { workoutA, workoutB, workoutC } = req.body;

  const workout = await UserWorkout.create({
    user: currentUser._id,
    workoutA,
    workoutB,
    workoutC,
  });

  if (workout) {
    res.status(StatusCode.Created).json({ message: 'Workout created' });
  } else {
    throw new AppError('Invalid workout data', StatusCode.BadRequest);
  }
};

export const updateUserWorkout = async (req: Request, res: Response) => {
  const { id, workoutA, workoutB, workoutC } = req.body;

  if (!id) {
    throw new AppError('Missing required fields', StatusCode.BadRequest);
  }

  const workout = await UserWorkout.findById(id).exec();

  if (!workout) {
    throw new AppError('Workout not found', StatusCode.NotFound);
  }

  workout.workoutA = workoutA ?? null;
  workout.workoutB = workoutB ?? null;
  workout.workoutC = workoutC ?? null;

  const updatedWorkout = await workout.save();
  res.json({ message: `User workout ${updatedWorkout.id} updated` });
};

export const deleteUserWorkout = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    throw new AppError('Missing required fields', StatusCode.BadRequest);
  }

  const workout = await UserWorkout.findById(id).exec();

  if (!workout) {
    throw new AppError('Workout not found', StatusCode.NotFound);
  }

  await workout.deleteOne();
  res.json({ message: `User workout ${workout.id} deleted` });
};
