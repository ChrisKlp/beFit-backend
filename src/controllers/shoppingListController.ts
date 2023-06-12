import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Menu from '../models/Menu';
import ShoppingList from '../models/ShoppingList';
import { AppError, StatusCode } from '../utils/AppError';
import getCurrentUser from '../utils/getCurrentUser';

export const getShoppingList = async (req: Request, res: Response) => {
  const currentUser = await getCurrentUser(req);

  const shoppingList = await ShoppingList.find({
    user: currentUser._id,
  })
    .populate('products.ingredient')
    .lean();

  if (!shoppingList?.length) {
    throw new AppError('No shopping list found', StatusCode.NotFound);
  }

  res.json(shoppingList);
};

export const createShoppingList = async (req: Request, res: Response) => {
  const currentUser = await getCurrentUser(req);

  const userMenus = await Menu.find({ user: currentUser._id })
    .populate('breakfast')
    .populate('secondBreakfast')
    .populate('dinner')
    .populate('supper')
    .select('breakfast secondBreakfast dinner supper')
    .lean()
    .exec();

  if (!userMenus?.length) {
    throw new AppError('No menus found', StatusCode.NotFound);
  }

  const recipesArr = userMenus
    .map((menu) => [
      menu.breakfast,
      menu.secondBreakfast,
      menu.dinner,
      menu.supper,
    ])
    .flat()
    .filter((menu) => menu !== null) as any[];

  if (!recipesArr?.length) {
    throw new AppError('No recipes found', StatusCode.NotFound);
  }

  const ingredientsArr = recipesArr
    .map((recipe) => recipe.ingredients)
    .flat()
    .reduce((acc, ingredient) => {
      const existingIngredient = acc.find(
        (accIngredient: any) =>
          accIngredient.ingredient.toString() ===
          ingredient.ingredient.toString()
      );

      if (existingIngredient) {
        existingIngredient.quantity += ingredient.quantity;
      } else {
        acc.push({
          ingredient: ingredient.ingredient,
          quantity: ingredient.quantity,
        });
      }
      return acc;
    }, [] as { ingredient: mongoose.Types.ObjectId; quantity: number }[]);

  if (!ingredientsArr?.length) {
    throw new AppError('No ingredients found', StatusCode.NotFound);
  }

  const shoppingList = await ShoppingList.create({
    user: currentUser._id,
    products: ingredientsArr,
  });

  if (shoppingList) {
    res.status(StatusCode.Created).json({ message: 'Shopping list created' });
  } else {
    throw new AppError('Invalid shopping list data', StatusCode.BadRequest);
  }
};

export const updateShoppingList = async (req: Request, res: Response) => {
  const { id, products } = req.body;

  if (!id || !products) {
    throw new AppError('Missing required fields', StatusCode.BadRequest);
  }

  const shoppingList = await ShoppingList.findById(id).exec();

  if (!shoppingList) {
    throw new AppError('Shopping list not found', StatusCode.NotFound);
  }

  shoppingList.products = products;

  const updatedShoppingList = await shoppingList.save();
  res.json({ message: `Shopping list ${updatedShoppingList.id} updated` });
};

export const deleteShoppingList = async (req: Request, res: Response) => {
  const currentUser = await getCurrentUser(req);

  await ShoppingList.deleteMany({
    user: currentUser._id,
  }).exec();

  res.json({ message: `Shopping list deleted` });
};
