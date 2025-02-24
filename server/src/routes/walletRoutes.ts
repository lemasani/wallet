import { Router } from 'express';
import { createWalletAccount } from '../controllers/walletAccountController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/create-account', authenticateToken, createWalletAccount);

export default router; 