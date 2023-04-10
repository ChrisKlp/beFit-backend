import express from 'express';
import {
  createExercise,
  deleteExercise,
  getAllExercises,
  updateExercise,
} from '../controllers/exercisesController';

const router = express.Router();

router
  .route('/')
  .get(getAllExercises)
  .post(createExercise)
  .patch(updateExercise)
  .delete(deleteExercise);

export default router;
