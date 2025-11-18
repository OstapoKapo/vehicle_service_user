import express from 'express';
const router = express.Router();

import userController from '../controllers/user.controller.js';
import { authMiddleware } from '../common/middleware/auth.middleware.js';
import { validateDto } from '../common/middleware/validation.middleware.js';
import { CreateUserDto, UpdateUserDto } from '../common/dto/user.dto.js';

router.post('/',authMiddleware, validateDto(CreateUserDto), userController.createUser);

router.get('/', userController.getAllUsers);

router.put('/:id',authMiddleware, validateDto(UpdateUserDto), userController.updateUser);

router.delete('/:id', authMiddleware, userController.deleteUser);

router.get('/:id', userController.getUser);

export default router;