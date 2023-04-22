import express from 'express';
import {
  getAllRecipes,
  createRecipe,
  deleteRecipe,
  updateRecipe,
} from '../controllers/recipesController';
import upload from '../middleware/upload';

const router = express.Router();

router
  .route('/')
  .get(getAllRecipes)
  .post(upload.single('image'), createRecipe)
  .patch(upload.single('image'), updateRecipe)
  .delete(deleteRecipe);

export default router;
