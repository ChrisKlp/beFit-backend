import { Request, Response } from 'express';
import Category from '../models/Category';
import { AppError, StatusCode } from '../utils/AppError';

export const getAllCategories = async (req: Request, res: Response) => {
  const categories = await Category.find().lean();

  if (!categories?.length) {
    throw new AppError('No categories found', StatusCode.NotFound);
  }

  res.json(categories);
};

export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    throw new AppError('Missing required fields', StatusCode.BadRequest);
  }

  const duplicate = await Category.findOne({ name }).lean().exec();

  if (duplicate) {
    throw new AppError('Category already exists', StatusCode.Conflict);
  }

  const category = await Category.create({
    name,
  });

  if (category) {
    res.status(StatusCode.Created).json({ message: 'Category created' });
  } else {
    res
      .status(StatusCode.BadRequest)
      .json({ message: 'Invalid category data' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id, name } = req.body;

  if (!id || !name) {
    throw new AppError('Missing required fields', StatusCode.BadRequest);
  }

  const category = await Category.findById(id).exec();

  if (!category) {
    throw new AppError('Category not found', StatusCode.NotFound);
  }

  const duplicate = await Category.findOne({ name }).lean().exec();

  if (duplicate && duplicate._id.toString() !== id) {
    throw new AppError('Category already exists', StatusCode.Conflict);
  }

  category.name = name;

  const updatedCategory = await category.save();
  res.json({ message: `Category ${updatedCategory.name} updated` });
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    throw new AppError('Missing required fields', StatusCode.BadRequest);
  }

  const category = await Category.findById(id).exec();

  if (!category) {
    throw new AppError('Category not found', StatusCode.NotFound);
  }

  await category.deleteOne();
  res.json({
    message: `Category ${category.name} with ${category.id} deleted`,
  });
};
