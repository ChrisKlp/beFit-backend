import express from 'express';
import loginLimiter from '../middleware/loginLimiter';
import { login, logout, refresh } from '../controllers/authController';

const router = express.Router();

router.route('/').post(loginLimiter, login);

router.route('/refresh').get(refresh);

router.route('/logout').post(logout);

export default router;
