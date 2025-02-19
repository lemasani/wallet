import { Router } from 'express';
import {createUserController, userLoginController} from '../controllers/userController';

// Initialize router
const userRoutes = Router();

// routes
userRoutes.post('/', createUserController);
userRoutes.get('/', userLoginController)

export default userRoutes;