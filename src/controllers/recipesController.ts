import asyncHandler from 'express-async-handler';
import Recipe from '../models/Recipe';

export const getAllRecipes = asyncHandler(async (req, res) => {
  const recipes = await Recipe.find({}).populate('ingredients.ingredient');

  if (!recipes?.length) {
    res.status(400).json({ message: 'No recipes found' });
    return;
  }

  res.json(recipes);
});

export const createRecipe = asyncHandler(async (req, res) => {
  const {
    title,
    calories,
    protein,
    carbohydrates,
    fat,
    instructions,
    ingredients,
  } = req.body;

  const recipe = await Recipe.create({
    title,
    calories,
    protein,
    carbohydrates,
    fat,
    instructions,
    ingredients,
  });

  if (recipe) {
    res.status(201).json(recipe);
  } else {
    res.status(400);
    throw new Error('Invalid recipe data');
  }
});

export const updateRecipe = asyncHandler(async (req, res) => {
  const { title, calories, protein, carbohydrates, fat, instructions } =
    req.body;

  const recipe = await Recipe.findById(req.params.id);

  if (recipe) {
    recipe.title = title;
    recipe.calories = calories;
    recipe.protein = protein;
    recipe.carbohydrates = carbohydrates;
    recipe.fat = fat;
    recipe.instructions = instructions;

    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } else {
    res.status(404);
    throw new Error('Recipe not found');
  }
});

export const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (recipe) {
    await recipe.deleteOne();
    res.json({ message: 'Recipe removed' });
  } else {
    res.status(404);
    throw new Error('Recipe not found');
  }
});
