import express from 'express';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoriesController';

const router = express.Router();

router
  .route('/')
  .get(getAllCategories)
  .post(createCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

export default router;
