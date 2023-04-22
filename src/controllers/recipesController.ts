import asyncHandler from 'express-async-handler';
import Recipe from '../models/Recipe';
import { uploadImage } from '../config/cloudinary';

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
  if (Object.entries(req.body).length) {
    Object.entries(req.body).forEach(([key, value]) => {
      if (
        value !== 'undefined' &&
        value !== 'null' &&
        typeof value === 'string'
      ) {
        req.body[key] = JSON.parse(value);
      }
    });
  }

  const {
    title,
    calories,
    protein,
    carbohydrates,
    fat,
    ingredients,
    instructions,
    categories,
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

  const imagePath = req.file?.path || '';

  const { isSuccess, url } = await uploadImage(imagePath, 'recipes');

  const recipe = await Recipe.create({
    title,
    categories,
    calories,
    protein,
    carbohydrates,
    fat,
    instructions,
    ingredients,
    image: url,
  });

  if (recipe && isSuccess) {
    res.status(201).json({ message: 'Recipe created with image' });
  } else if (recipe && !isSuccess) {
    res.status(201).json({ message: 'Recipe created without image' });
  } else {
    res.status(400).json({ message: 'Invalid recipe data' });
  }
});

export const updateRecipe = asyncHandler(async (req, res) => {
  if (Object.entries(req.body).length) {
    Object.entries(req.body).forEach(([key, value]) => {
      if (
        value !== 'undefined' &&
        value !== 'null' &&
        typeof value === 'string'
      ) {
        req.body[key] = JSON.parse(value);
      }
    });
  }

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

  const imagePath = req.file?.path || '';

  const { isSuccess, url } = await uploadImage(imagePath, 'recipes');

  recipe.title = title;
  if (url) recipe.image = url;
  recipe.categories = categories;
  recipe.calories = calories;
  recipe.protein = protein;
  recipe.carbohydrates = carbohydrates;
  recipe.fat = fat;
  recipe.instructions = instructions;
  recipe.ingredients = ingredients;

  const updatedRecipe = await recipe.save();
  if (isSuccess) {
    res.json({ message: `Recipe ${updatedRecipe.title} updated with image` });
  } else {
    res.json({
      message: `Recipe ${updatedRecipe.title} updated without image`,
    });
  }
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
