import express from 'express';
import {
  createShoppingList,
  deleteShoppingList,
  getShoppingList,
  updateShoppingList,
} from '../controllers/shoppingListController';
import verifyJWT, { CustomRequest } from '../middleware/verifyJWT';

const router = express.Router();

router.use((req, res, next) => verifyJWT(req as CustomRequest, res, next));

router
  .route('/')
  .get(getShoppingList)
  .post(createShoppingList)
  .patch(updateShoppingList)
  .delete(deleteShoppingList);

export default router;
