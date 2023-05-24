import express from 'express';
import {
  createExercise,
  deleteExercise,
  getAllExercises,
  updateExercise,
} from '../controllers/exercisesController';
import verifyJWT, { CustomRequest } from '../middleware/verifyJWT';
import verifyIsAdmin from '../middleware/verifyIsAdmin';

const router = express.Router();

router.use((req, res, next) => verifyJWT(req as CustomRequest, res, next));

router
  .route('/')
  .get(getAllExercises)
  .post(verifyIsAdmin, createExercise)
  .patch(verifyIsAdmin, updateExercise)
  .delete(verifyIsAdmin, deleteExercise);

export default router;
