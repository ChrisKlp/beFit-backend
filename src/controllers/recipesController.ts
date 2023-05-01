import { Request, Response } from 'express';
import { uploadImage } from '../config/cloudinary';
import Recipe from '../models/Recipe';
import { AppError, StatusCode } from '../utils/AppError';

function parseReqToJson(req: Request) {
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
}

export const getAllRecipes = async (req: Request, res: Response) => {
  const recipes = await Recipe.find()
    .populate('ingredients.ingredient')
    .populate('categories')
    .lean();

  if (!recipes?.length) {
    throw new AppError('No recipes found', StatusCode.NotFound);
  }

  res.json(recipes);
};

export const createRecipe = async (req: Request, res: Response) => {
  parseReqToJson(req);

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
    throw new AppError('Missing required fields', StatusCode.BadRequest);
  }

  const duplicate = await Recipe.findOne({ title }).lean().exec();

  if (duplicate) {
    throw new AppError('Recipe already exists', StatusCode.Conflict);
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
    res
      .status(StatusCode.Created)
      .json({ message: 'Recipe created with image' });
  } else if (recipe && !isSuccess) {
    res
      .status(StatusCode.Created)
      .json({ message: 'Recipe created without image' });
  } else {
    throw new AppError('Invalid recipe data', StatusCode.BadRequest);
  }
};

export const updateRecipe = async (req: Request, res: Response) => {
  parseReqToJson(req);

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
    throw new AppError('Missing required fields', StatusCode.BadRequest);
  }

  const recipe = await Recipe.findById(id).exec();

  if (!recipe) {
    throw new AppError('Recipe not found', StatusCode.NotFound);
  }

  const duplicate = await Recipe.findOne({ title }).lean().exec();

  if (duplicate && duplicate._id.toString() !== id) {
    throw new AppError('Recipe already exists', StatusCode.Conflict);
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
};

export const deleteRecipe = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    throw new AppError('Missing required fields', StatusCode.BadRequest);
  }

  const recipe = await Recipe.findById(id).exec();

  if (!recipe) {
    throw new AppError('Recipe not found', StatusCode.NotFound);
  }

  await recipe.deleteOne();
  res.json({
    message: `Recipe ${recipe.title} with ${recipe.id} deleted`,
  });
};
