import { Router } from 'express';
import { userLoginController, refreshTokenController, logoutController } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/login', userLoginController);
router.post('/refresh-token', refreshTokenController);

// Protected routes
router.post('/logout', authenticateToken, logoutController);

export default router;
