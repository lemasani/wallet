import { Router } from 'express';
import { userLoginController } from '../controllers/authController';
import { refreshTokenController } from '../controllers/refreshTokenController';

const authRoutes = Router();

// Route for user login
authRoutes.post('/login', userLoginController);

// Route for refreshing tokens
authRoutes.post('/refresh-token', refreshTokenController);

export default authRoutes;
