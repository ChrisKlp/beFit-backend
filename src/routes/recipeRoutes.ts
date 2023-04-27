import express from 'express';
import {
  getAllRecipes,
  createRecipe,
  deleteRecipe,
  updateRecipe,
} from '../controllers/recipesController';
import upload from '../middleware/upload';
import verifyJWT, { CustomRequest } from '../middleware/verifyJWT';

const router = express.Router();

router.use((req, res, next) => verifyJWT(req as CustomRequest, res, next));

router
  .route('/')
  .get(getAllRecipes)
  .post(upload.single('image'), createRecipe)
  .patch(upload.single('image'), updateRecipe)
  .delete(deleteRecipe);

export default router;
