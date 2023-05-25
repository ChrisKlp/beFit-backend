import { Request, Response } from 'express';
import Menu from '../models/Menu';
import { AppError, StatusCode } from '../utils/AppError';
import getCurrentUser from '../utils/getCurrentUser';

export const getAllUserMenus = async (req: Request, res: Response) => {
  const currentUser = await getCurrentUser(req);

  const menus = await Menu.find({ user: currentUser._id }).lean();

  if (!menus?.length) {
    throw new AppError('No menus found', StatusCode.NotFound);
  }

  res.json(menus);
};

export const createUserMenu = async (req: Request, res: Response) => {
  const currentUser = await getCurrentUser(req);

  const { breakfast, secondBreakfast, dinner, supper } = req.body;

  const menu = await Menu.create({
    user: currentUser._id,
    breakfast,
    secondBreakfast,
    dinner,
    supper,
  });

  if (menu) {
    res.status(StatusCode.Created).json({ message: 'Menu created' });
  } else {
    throw new AppError('Invalid menu data', StatusCode.BadRequest);
  }
};

export const updateUserMenu = async (req: Request, res: Response) => {
  const { id, breakfast, secondBreakfast, dinner, supper } = req.body;

  if (!id) {
    throw new AppError('Missing required fields', StatusCode.BadRequest);
  }

  const menu = await Menu.findById(id).exec();

  if (!menu) {
    throw new AppError('Menu not found', StatusCode.NotFound);
  }

  menu.breakfast = breakfast ?? null;
  menu.secondBreakfast = secondBreakfast ?? null;
  menu.dinner = dinner ?? null;
  menu.supper = supper ?? null;

  const updatedMenu = await menu.save();
  res.json({ message: `Menu ${updatedMenu.id} updated` });
};

export const deleteUserMenu = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    throw new AppError('Missing required fields', StatusCode.BadRequest);
  }

  const menu = await Menu.findById(id).exec();

  if (!menu) {
    throw new AppError('Menu not found', StatusCode.NotFound);
  }

  await menu.deleteOne();

  res.json({
    message: `Menu ${menu.id} deleted`,
  });
};
