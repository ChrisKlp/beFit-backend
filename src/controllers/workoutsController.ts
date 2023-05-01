import { Request, Response } from 'express';
import Workout from '../models/Workout';
import { AppError, StatusCode } from '../utils/AppError';

export const getAllWorkouts = async (req: Request, res: Response) => {
  const workouts = await Workout.find().populate('exercises.exercise').lean();

  if (!workouts?.length) {
    throw new AppError('No workouts found', StatusCode.NotFound);
  }

  res.json(workouts);
};

export const createWorkout = async (req: Request, res: Response) => {
  const { name, type, level, exercises } = req.body;

  if (!name || !exercises) {
    throw new AppError('Missing required fields', StatusCode.BadRequest);
  }

  const duplicate = await Workout.findOne({ name }).lean().exec();

  if (duplicate) {
    throw new AppError('Workout already exists', StatusCode.Conflict);
  }

  const workout = await Workout.create({
    name,
    type,
    level,
    exercises,
  });

  if (workout) {
    res.status(StatusCode.Created).json({ message: 'Workout created' });
  } else {
    res.status(StatusCode.BadRequest).json({ message: 'Invalid workout data' });
  }
};

export const updateWorkout = async (req: Request, res: Response) => {
  const { id, name, type, level, exercises } = req.body;

  if (!id || !name || !exercises) {
    throw new AppError('Missing required fields', StatusCode.BadRequest);
  }

  const workout = await Workout.findById(id).exec();

  if (!workout) {
    throw new AppError('Workout not found', StatusCode.NotFound);
  }

  const duplicate = await Workout.findOne({ name }).lean().exec();

  if (duplicate && duplicate._id.toString() !== id) {
    throw new AppError('Workout already exists', StatusCode.Conflict);
  }

  workout.name = name;
  workout.type = type;
  workout.level = level;
  workout.exercises = exercises;

  const updatedWorkout = await workout.save();
  res.json({ message: `Workout ${updatedWorkout.name} updated` });
};

export const deleteWorkout = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    throw new AppError('Missing required fields', StatusCode.BadRequest);
  }

  const workout = await Workout.findById(id).exec();

  if (!workout) {
    throw new AppError('Workout not found', StatusCode.NotFound);
  }

  await workout.deleteOne();
  res.json({ message: `Workout ${workout.name} with ${workout.id} deleted` });
};
