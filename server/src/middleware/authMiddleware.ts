import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';
import db from '../utils/db';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
            };
        }
    }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            throw new AppError('Authentication required', 401);
        }

        // Verify access token
        const decoded = verifyAccessToken(token);
        if (!decoded) {
            throw new AppError('Invalid token', 401);
        }

        // Check if user exists
        const user = await db.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true }
        });

        if (!user) {
            throw new AppError('User not found', 401);
        }

        // Check if there's a valid session
        const session = await db.session.findFirst({
            where: {
                userId: user.id,
                isValid: true
            }
        });

        if (!session) {
            throw new AppError('No valid session found', 401);
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}; 