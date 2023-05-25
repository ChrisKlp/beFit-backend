import express from 'express';
import {
  createUserMenu,
  deleteUserMenu,
  getAllUserMenus,
  updateUserMenu,
} from '../controllers/menusController';
import verifyJWT, { CustomRequest } from '../middleware/verifyJWT';

const router = express.Router();

router.use((req, res, next) => verifyJWT(req as CustomRequest, res, next));

router
  .route('/')
  .get(getAllUserMenus)
  .post(createUserMenu)
  .patch(updateUserMenu)
  .delete(deleteUserMenu);

export default router;
