import express from 'express';
console.log("USER ROUTES CARREGADAS");
import {
  createUserController,
  loginUserController,
  listUsersController,
  deleteUserController,
} from './userController.js';

const router = express.Router();

router.post('/', createUserController);
router.post('/login', loginUserController);
router.get('/', listUsersController);
router.delete('/:id', deleteUserController);

export default router;