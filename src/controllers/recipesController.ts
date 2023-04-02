import asyncHandler from 'express-async-handler';
import Recipe from '../models/Recipe';

export const getAllRecipes = asyncHandler(async (req, res) => {
  const recipes = await Recipe.find()
    .populate('ingredients.ingredient')
    .populate('categories')
    .lean();

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
    categories,
    image,
  } = req.body;

  if (!title || !ingredients) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const duplicate = await Recipe.findOne({ title }).lean().exec();

  if (duplicate) {
    res.status(409).json({ message: 'Recipe already exists' });
    return;
  }

  const recipe = await Recipe.create({
    title,
    image,
    categories,
    calories,
    protein,
    carbohydrates,
    fat,
    instructions,
    ingredients,
  });

  if (recipe) {
    res.status(201).json({ message: 'Recipe created' });
  } else {
    res.status(400).json({ message: 'Invalid recipe data' });
  }
});

export const updateRecipe = asyncHandler(async (req, res) => {
  const {
    id,
    title,
    calories,
    protein,
    carbohydrates,
    fat,
    instructions,
    ingredients,
    categories,
    image,
  } = req.body;

  if (!id || !title || !ingredients) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const recipe = await Recipe.findById(id).exec();

  if (!recipe) {
    res.status(404).json({ message: 'Recipe not found' });
    return;
  }

  const duplicate = await Recipe.findOne({ title }).lean().exec();

  if (duplicate && duplicate._id.toString() !== id) {
    res.status(409).json({ message: 'Recipe already exists' });
    return;
  }

  recipe.title = title;
  recipe.image = image;
  recipe.categories = categories;
  recipe.calories = calories;
  recipe.protein = protein;
  recipe.carbohydrates = carbohydrates;
  recipe.fat = fat;
  recipe.instructions = instructions;
  recipe.ingredients = ingredients;

  const updatedRecipe = await recipe.save();
  res.json({ message: `Recipe ${updatedRecipe.title} updated` });
});

export const deleteRecipe = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const recipe = await Recipe.findById(id).exec();

  if (!recipe) {
    res.status(404).json({ message: 'Recipe not found' });
    return;
  }

  await recipe.deleteOne();
  res.json({
    message: `Recipe ${recipe.title} with ${recipe.id} deleted`,
  });
});
