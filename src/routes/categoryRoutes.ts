import express from 'express';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoriesController';
import verifyJWT, { CustomRequest } from '../middleware/verifyJWT';
import verifyIsAdmin from '../middleware/verifyIsAdmin';

const router = express.Router();

router.use((req, res, next) => verifyJWT(req as CustomRequest, res, next));

router
  .route('/')
  .get(getAllCategories)
  .post(verifyIsAdmin, createCategory)
  .patch(verifyIsAdmin, updateCategory)
  .delete(verifyIsAdmin, deleteCategory);

export default router;
