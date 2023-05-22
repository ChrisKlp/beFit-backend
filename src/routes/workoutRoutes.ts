import express from 'express';
import {
  getAllWorkouts,
  createWorkout,
  deleteWorkout,
  updateWorkout,
} from '../controllers/workoutsController';
import verifyJWT, { CustomRequest } from '../middleware/verifyJWT';

const router = express.Router();

router.use((req, res, next) => verifyJWT(req as CustomRequest, res, next));

router
  .route('/')
  .get(getAllWorkouts)
  .post(createWorkout)
  .patch(updateWorkout)
  .delete(deleteWorkout);

export default router;
