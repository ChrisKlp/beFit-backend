import { Request, Response } from 'express';
import Exercise from '../models/Exercise';
import { AppError, StatusCode } from '../utils/AppError';

export const getAllExercises = async (req: Request, res: Response) => {
  const exercises = await Exercise.find().lean();

  if (!exercises?.length) {
    throw new AppError('No exercises found', StatusCode.NotFound);
  }

  res.json(exercises);
};

export const createExercise = async (req: Request, res: Response) => {
  const { name, videoUrl, type } = req.body;

  if (!name) {
    throw new AppError('Missing required fields', StatusCode.BadRequest);
  }

  const duplicate = await Exercise.findOne({ name }).lean().exec();

  if (duplicate) {
    throw new AppError('Exercise already exists', StatusCode.Conflict);
  }

  const exercise = await Exercise.create({
    name,
    videoUrl,
    type,
  });

  if (exercise) {
    res.status(StatusCode.Created).json({ message: 'Exercise created' });
  } else {
    res
      .status(StatusCode.BadRequest)
      .json({ message: 'Invalid exercise data' });
  }
};

export const updateExercise = async (req: Request, res: Response) => {
  const { id, name, videoUrl, type } = req.body;

  if (!id || !name) {
    throw new AppError('Missing required fields', StatusCode.BadRequest);
  }

  const exercise = await Exercise.findById(id).exec();

  if (!exercise) {
    throw new AppError('Exercise not found', StatusCode.NotFound);
  }

  const duplicate = await Exercise.findOne({ name }).lean().exec();

  if (duplicate && duplicate._id.toString() !== id) {
    throw new AppError('Exercise already exists', StatusCode.Conflict);
  }

  exercise.name = name;
  exercise.videoUrl = videoUrl;
  exercise.type = type;

  const updatedExercise = await exercise.save();

  res.json({ message: `Exercise ${updatedExercise.name} updated` });
};

export const deleteExercise = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    throw new AppError('Missing required fields', StatusCode.BadRequest);
  }

  const exercise = await Exercise.findById(id).exec();

  if (!exercise) {
    throw new AppError('Exercise not found', StatusCode.NotFound);
  }

  await exercise.deleteOne();
  res.json({
    message: `Exercise ${exercise.name} with ${id} deleted`,
  });
};
