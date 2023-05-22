import express from 'express';
import {
  createExercise,
  deleteExercise,
  getAllExercises,
  updateExercise,
} from '../controllers/exercisesController';
import verifyJWT, { CustomRequest } from '../middleware/verifyJWT';

const router = express.Router();

router.use((req, res, next) => verifyJWT(req as CustomRequest, res, next));

router
  .route('/')
  .get(getAllExercises)
  .post(createExercise)
  .patch(updateExercise)
  .delete(deleteExercise);

export default router;
