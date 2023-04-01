import express from 'express';
import {
  getAllIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from '../controllers/ingredientsController';

const router = express.Router();

router
  .route('/')
  .get(getAllIngredients)
  .post(createIngredient)
  .patch(updateIngredient)
  .delete(deleteIngredient);

export default router;
