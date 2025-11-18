import express from 'express';
const router = express.Router();

import authController from '../controllers/auth.controller.js';
import { authMiddleware } from '../common/middleware/auth.middleware.js';
import { validateDto } from '../common/middleware/validation.middleware.js';
import { LoginDto } from '../common/dto/auth.dto.js';

router.post('/login', validateDto(LoginDto), authController.login);

router.post('/logout', authMiddleware, authController.logout);

export default router;