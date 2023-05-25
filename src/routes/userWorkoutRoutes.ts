import express from 'express';
import {
  createUserWorkout,
  deleteUserWorkout,
  getAllUserWorkouts,
  updateUserWorkout,
} from '../controllers/userWorkoutsController';
import verifyJWT, { CustomRequest } from '../middleware/verifyJWT';

const router = express.Router();

router.use((req, res, next) => verifyJWT(req as CustomRequest, res, next));

router
  .route('/')
  .get(getAllUserWorkouts)
  .post(createUserWorkout)
  .patch(updateUserWorkout)
  .delete(deleteUserWorkout);

export default router;
