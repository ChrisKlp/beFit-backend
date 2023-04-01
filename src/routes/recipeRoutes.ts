import express from 'express';
import {
  getAllRecipes,
  createRecipe,
  deleteRecipe,
  updateRecipe,
} from '../controllers/recipesController';

const router = express.Router();

router
  .route('/')
  .get(getAllRecipes)
  .post(createRecipe)
  .patch(updateRecipe)
  .delete(deleteRecipe);

export default router;
