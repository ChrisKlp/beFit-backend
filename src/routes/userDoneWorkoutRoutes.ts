import express from 'express';

import verifyJWT, { CustomRequest } from '../middleware/verifyJWT';
import {
  createUserDoneWorkout,
  deleteUserDoneWorkout,
  getAllUserDoneWorkouts,
  getCurrentWorkoutHistory,
} from '../controllers/userDoneWorkoutsController';

const router = express.Router();

router.use((req, res, next) => verifyJWT(req as CustomRequest, res, next));

router
  .route('/')
  .get(getAllUserDoneWorkouts)
  .post(createUserDoneWorkout)
  .delete(deleteUserDoneWorkout);

router.route('/:id').get(getCurrentWorkoutHistory);

export default router;
