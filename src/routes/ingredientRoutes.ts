import express from 'express';
import {
  getAllIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from '../controllers/ingredientsController';
import verifyJWT, { CustomRequest } from '../middleware/verifyJWT';
import verifyIsAdmin from '../middleware/verifyIsAdmin';

const router = express.Router();

router.use((req, res, next) => verifyJWT(req as CustomRequest, res, next));

router
  .route('/')
  .get(getAllIngredients)
  .post(verifyIsAdmin, createIngredient)
  .patch(verifyIsAdmin, updateIngredient)
  .delete(verifyIsAdmin, deleteIngredient);

export default router;
