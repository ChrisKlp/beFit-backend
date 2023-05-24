import express from 'express';
import {
  getAllWorkouts,
  createWorkout,
  deleteWorkout,
  updateWorkout,
} from '../controllers/workoutsController';
import verifyJWT, { CustomRequest } from '../middleware/verifyJWT';
import verifyIsAdmin from '../middleware/verifyIsAdmin';

const router = express.Router();

router.use((req, res, next) => verifyJWT(req as CustomRequest, res, next));

router
  .route('/')
  .get(getAllWorkouts)
  .post(verifyIsAdmin, createWorkout)
  .patch(verifyIsAdmin, updateWorkout)
  .delete(verifyIsAdmin, deleteWorkout);

export default router;
