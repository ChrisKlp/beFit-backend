import asyncHandler from 'express-async-handler';
import Workout from '../models/Workout';

export const getAllWorkouts = asyncHandler(async (req, res) => {
  const workouts = await Workout.find().populate('exercises.exercise').lean();

  if (!workouts?.length) {
    res.status(400).json({ message: 'No workouts found' });
    return;
  }

  res.json(workouts);
});

export const createWorkout = asyncHandler(async (req, res) => {
  const { name, type, level, exercises } = req.body;

  if (!name || !exercises) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const duplicate = await Workout.findOne({ name }).lean().exec();

  if (duplicate) {
    res.status(409).json({ message: 'Workout already exists' });
    return;
  }

  const workout = await Workout.create({
    name,
    type,
    level,
    exercises,
  });

  if (workout) {
    res.status(201).json({ message: 'Workout created' });
  } else {
    res.status(400).json({ message: 'Invalid workout data' });
  }
});

export const updateWorkout = asyncHandler(async (req, res) => {
  const { id, name, type, level, exercises } = req.body;

  if (!id || !name || !exercises) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const workout = await Workout.findById(id).exec();

  if (!workout) {
    res.status(404).json({ message: 'Workout not found' });
    return;
  }

  const duplicate = await Workout.findOne({ name }).lean().exec();

  if (duplicate && duplicate._id.toString() !== id) {
    res.status(409).json({ message: 'Workout already exists' });
    return;
  }

  workout.name = name;
  workout.type = type;
  workout.level = level;
  workout.exercises = exercises;

  const updatedWorkout = await workout.save();
  res.status(200).json({ message: `Workout ${updatedWorkout.name} updated` });
});

export const deleteWorkout = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const workout = await Workout.findById(id).exec();

  if (!workout) {
    res.status(404).json({ message: 'Workout not found' });
    return;
  }

  await workout.deleteOne();
  res.json({ message: `Workout ${workout.name} with ${workout.id} deleted` });
});
