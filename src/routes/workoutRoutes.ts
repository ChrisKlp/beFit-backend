import express from 'express';
import {
  getAllWorkouts,
  createWorkout,
  deleteWorkout,
  updateWorkout,
} from '../controllers/workoutsController';

const router = express.Router();

router
  .route('/')
  .get(getAllWorkouts)
  .post(createWorkout)
  .patch(updateWorkout)
  .delete(deleteWorkout);

export default router;
