import { Router } from 'express';
import {createUserController} from '../controllers/userController';

// Initialize router
const userRoutes = Router();

// routes
userRoutes.post('/', createUserController);

export default userRoutes;