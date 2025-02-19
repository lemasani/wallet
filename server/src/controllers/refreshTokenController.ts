import { Request, Response, NextFunction } from 'express';
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';

export const refreshTokenController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<any> => {
	try {
		// The refresh token should be sent in the request body or as an httpOnly cookie.
		const { refreshToken } = req.body;
		if (!refreshToken) {
			throw new AppError('Refresh token is required', 401);
		}
		
		// Verify the refresh token
		const decoded = verifyRefreshToken(refreshToken) as any;
		
		// Optionally, you might want to check whether the refresh token exists in your database or has been revoked.
		
		// Generate new tokens based on the payload from the refresh token
		const payload = { id: decoded.id, email: decoded.email };
		const newAccessToken = generateAccessToken(payload);
		const newRefreshToken = generateRefreshToken(payload);
		
		return res.status(200).json({
			success: true,
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
		});
	} catch (error) {
		next(error);
	}
};
