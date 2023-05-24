import express from 'express';
import {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
} from '../controllers/usersController';
import verifyJWT, { CustomRequest } from '../middleware/verifyJWT';
import verifyIsAdmin from '../middleware/verifyIsAdmin';

const router = express.Router();

router.use((req, res, next) => verifyJWT(req as CustomRequest, res, next));

router
  .route('/')
  .get(getAllUsers)
  .post(verifyIsAdmin, createNewUser)
  .patch(verifyIsAdmin, updateUser)
  .delete(verifyIsAdmin, deleteUser);

export default router;
