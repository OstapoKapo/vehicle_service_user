import express from 'express';
const router = express.Router();

import userController from '../controllers/auth.controller.js';
import { authMiddleware } from '../common/middleware/auth.middleware.js';

router.post('/signup', userController.signup);

router.post('/login',userController.login);

router.get('/me', authMiddleware, userController.me);

export default router;