import asyncHandler from 'express-async-handler';
import Ingredient from '../models/Ingredient';

export const getAllIngredients = asyncHandler(async (req, res) => {
  const ingredients = await Ingredient.find({});

  if (!ingredients?.length) {
    res.status(400).json({ message: 'No ingredients found' });
    return;
  }

  res.json(ingredients);
});

export const createIngredient = asyncHandler(async (req, res) => {
  const { name, calories, protein, carbohydrates, fat } = req.body;

  const ingredient = await Ingredient.create({
    name,
    calories,
    protein,
    carbohydrates,
    fat,
  });

  if (ingredient) {
    res.status(201).json(ingredient);
  } else {
    res.status(400);
    throw new Error('Invalid ingredient data');
  }
});
