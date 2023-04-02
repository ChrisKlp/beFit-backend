import asyncHandler from 'express-async-handler';
import Category from '../models/Category';

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().lean();

  if (!categories?.length) {
    res.status(400).json({ message: 'No categories found' });
    return;
  }

  res.json(categories);
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const duplicate = await Category.findOne({ name }).lean().exec();

  if (duplicate) {
    res.status(409).json({ message: 'Category already exists' });
    return;
  }

  const category = await Category.create({
    name,
  });

  if (category) {
    res.status(201).json({ message: 'Category created' });
  } else {
    res.status(400).json({ message: 'Invalid category data' });
  }
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id, name } = req.body;

  if (!id || !name) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const category = await Category.findById(id).exec();

  if (!category) {
    res.status(404).json({ message: 'Category not found' });
    return;
  }

  const duplicate = await Category.findOne({ name }).lean().exec();

  if (duplicate && duplicate._id.toString() !== id) {
    res.status(409).json({ message: 'Category already exists' });
    return;
  }

  category.name = name;

  const updatedCategory = await category.save();
  res.json({ message: `Category ${updatedCategory.name} updated` });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const category = await Category.findById(id).exec();

  if (!category) {
    res.status(404).json({ message: 'Category not found' });
    return;
  }

  await category.deleteOne();
  res.json({
    message: `Category ${category.name} with ${category.id} deleted`,
  });
});
