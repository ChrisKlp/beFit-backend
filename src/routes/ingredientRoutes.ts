import express from 'express';
import {
  getAllIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from '../controllers/ingredientsController';
import verifyJWT, { CustomRequest } from '../middleware/verifyJWT';

const router = express.Router();

router.use((req, res, next) => verifyJWT(req as CustomRequest, res, next));

router
  .route('/')
  .get(getAllIngredients)
  .post(createIngredient)
  .patch(updateIngredient)
  .delete(deleteIngredient);

export default router;
