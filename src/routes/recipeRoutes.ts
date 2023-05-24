import express from 'express';
import {
  getAllRecipes,
  createRecipe,
  deleteRecipe,
  updateRecipe,
} from '../controllers/recipesController';
import upload from '../middleware/upload';
import verifyJWT, { CustomRequest } from '../middleware/verifyJWT';
import verifyIsAdmin from '../middleware/verifyIsAdmin';

const router = express.Router();

router.use((req, res, next) => verifyJWT(req as CustomRequest, res, next));

router
  .route('/')
  .get(getAllRecipes)
  .post(verifyIsAdmin, upload.single('image'), createRecipe)
  .patch(verifyIsAdmin, upload.single('image'), updateRecipe)
  .delete(verifyIsAdmin, deleteRecipe);

export default router;
