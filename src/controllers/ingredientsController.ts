import { Request, Response } from 'express';
import Ingredient from '../models/Ingredient';
import { AppError, StatusCode } from '../utils/AppError';

export const getAllIngredients = async (req: Request, res: Response) => {
  const ingredients = await Ingredient.find().lean();

  if (!ingredients?.length) {
    throw new AppError('No ingredients found', StatusCode.NotFound);
  }

  res.json(ingredients);
};

export const createIngredient = async (req: Request, res: Response) => {
  const { name, unitWeight } = req.body;

  if (!name || !unitWeight) {
    throw new AppError('Missing required fields', StatusCode.BadRequest);
  }

  const duplicate = await Ingredient.findOne({ name }).lean().exec();

  if (duplicate) {
    throw new AppError('Ingredient already exists', StatusCode.Conflict);
  }

  const ingredient = await Ingredient.create({
    name,
    unitWeight,
  });

  if (ingredient) {
    res.status(StatusCode.Created).json({ message: 'Ingredient created' });
  } else {
    throw new AppError('Invalid ingredient data', StatusCode.BadRequest);
  }
};

export const updateIngredient = async (req: Request, res: Response) => {
  const { id, name, unitWeight } = req.body;

  if (!id || !name || !unitWeight) {
    throw new AppError('Missing required fields', StatusCode.BadRequest);
  }

  const ingredient = await Ingredient.findById(id).exec();

  if (!ingredient) {
    throw new AppError('Ingredient not found', StatusCode.NotFound);
  }

  const duplicate = await Ingredient.findOne({ name }).lean().exec();

  if (duplicate && duplicate._id.toString() !== id) {
    throw new AppError('Ingredient already exists', StatusCode.Conflict);
  }

  ingredient.name = name;
  ingredient.unitWeight = unitWeight;

  const updatedIngredient = await ingredient.save();
  res.json({ message: `Ingredient ${updatedIngredient.name} updated` });
};

export const deleteIngredient = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    throw new AppError('Missing required fields', StatusCode.BadRequest);
  }

  const ingredient = await Ingredient.findById(id).exec();

  if (!ingredient) {
    throw new AppError('Ingredient not found', StatusCode.NotFound);
  }

  await ingredient.deleteOne();
  res.json({
    message: `Ingredient ${ingredient.name} with ${ingredient.id} deleted`,
  });
};
