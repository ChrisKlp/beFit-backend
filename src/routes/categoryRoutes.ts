import express from 'express';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoriesController';
import verifyJWT, { CustomRequest } from '../middleware/verifyJWT';

const router = express.Router();

router.use((req, res, next) => verifyJWT(req as CustomRequest, res, next));

router
  .route('/')
  .get(getAllCategories)
  .post(createCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

export default router;
