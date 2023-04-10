import asyncHandler from 'express-async-handler';
import Exercise from '../models/Exercise';

export const getAllExercises = asyncHandler(async (req, res) => {
  const exercises = await Exercise.find().lean();

  if (!exercises?.length) {
    res.status(400).json({ message: 'No exercises found' });
    return;
  }

  res.json(exercises);
});

export const createExercise = asyncHandler(async (req, res) => {
  const { name, videoUrl, type } = req.body;

  if (!name) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const duplicate = await Exercise.findOne({ name }).lean().exec();

  if (duplicate) {
    res.status(409).json({ message: 'Exercise already exists' });
    return;
  }

  const exercise = await Exercise.create({
    name,
    videoUrl,
    type,
  });

  if (exercise) {
    res.status(201).json({ message: 'Exercise created' });
  } else {
    res.status(400).json({ message: 'Invalid exercise data' });
  }
});

export const updateExercise = asyncHandler(async (req, res) => {
  const { id, name, videoUrl, type } = req.body;

  if (!id || !name) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const exercise = await Exercise.findById(id).exec();

  if (!exercise) {
    res.status(404).json({ message: 'Exercise not found' });
    return;
  }

  const duplicate = await Exercise.findOne({ name }).lean().exec();

  if (duplicate && duplicate._id.toString() !== id) {
    res.status(409).json({ message: 'Exercise already exists' });
    return;
  }

  exercise.name = name;
  exercise.videoUrl = videoUrl;
  exercise.type = type;

  const updatedExercise = await exercise.save();

  res.json({ message: `Exercise ${updatedExercise.name} updated` });
});

export const deleteExercise = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const exercise = await Exercise.findById(id).exec();

  if (!exercise) {
    res.status(404).json({ message: 'Exercise not found' });
    return;
  }

  await exercise.deleteOne();
  res.json({
    message: `Exercise ${exercise.name} with ${id} deleted`,
  });
});
