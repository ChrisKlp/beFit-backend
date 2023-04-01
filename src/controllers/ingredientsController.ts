import asyncHandler from 'express-async-handler';
import Ingredient from '../models/Ingredient';

export const getAllIngredients = asyncHandler(async (req, res) => {
  const ingredients = await Ingredient.find().lean();

  if (!ingredients?.length) {
    res.status(400).json({ message: 'No ingredients found' });
    return;
  }

  res.json(ingredients);
});

export const createIngredient = asyncHandler(async (req, res) => {
  const { name, unitWeight } = req.body;

  if (!name || !unitWeight) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const duplicate = await Ingredient.findOne({ name }).lean().exec();

  if (duplicate) {
    res.status(409).json({ message: 'Ingredient already exists' });
    return;
  }

  const ingredient = await Ingredient.create({
    name,
    unitWeight,
  });

  if (ingredient) {
    res.status(201).json({ message: 'Ingredient created' });
  } else {
    res.status(400).json({ message: 'Invalid ingredient data' });
  }
});

export const updateIngredient = asyncHandler(async (req, res) => {
  const { id, name, unitWeight } = req.body;

  if (!id || !name || !unitWeight) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const ingredient = await Ingredient.findById(id).exec();

  if (!ingredient) {
    res.status(404).json({ message: 'Ingredient not found' });
    return;
  }

  const duplicate = await Ingredient.findOne({ name }).lean().exec();

  if (duplicate && duplicate._id.toString() !== id) {
    res.status(409).json({ message: 'Ingredient already exists' });
    return;
  }

  ingredient.name = name;
  ingredient.unitWeight = unitWeight;

  const updatedIngredient = await ingredient.save();
  res.json({ message: `Ingredient ${updatedIngredient.name} updated` });
});

export const deleteIngredient = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const ingredient = await Ingredient.findById(id).exec();

  if (!ingredient) {
    res.status(404).json({ message: 'Ingredient not found' });
    return;
  }

  await ingredient.deleteOne();
  res.json({
    message: `Ingredient ${ingredient.name} with ${ingredient.id} deleted`,
  });
});
