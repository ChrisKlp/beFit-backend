import express from 'express';
import {
  getAllIngredients,
  createIngredient,
} from '../controllers/ingredientsController';

const router = express.Router();

router.route('/').get(getAllIngredients).post(createIngredient);

export default router;
