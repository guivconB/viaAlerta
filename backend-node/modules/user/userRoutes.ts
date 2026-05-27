import express from 'express';
console.log("USER ROUTES CARREGADAS");
import {
  createUserController,
  loginUserController,
  listUsersController,
  deleteUserController,
  getMeController,
} from './userController.js';
import { authMiddleware } from '../../src/middlewares/auth.js';

const router = express.Router();

router.post('/', createUserController);
router.post('/login', loginUserController);
router.get('/me', authMiddleware, getMeController);
router.get('/', listUsersController);
router.delete('/:id', deleteUserController);

export default router;