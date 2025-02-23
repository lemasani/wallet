import { NextFunction, Request, Response } from 'express';
import { loginSchema } from '../models/user';
import db from '../utils/db';
import { AppError } from '../utils/AppError';
import { comparePassword } from '../utils/Encryption';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

export const userLoginController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
	try {
		const validateData = loginSchema.parse(req.body);
		const { email, password } = validateData;

		// Retrieve the user by email
		const user = await db.user.findUnique({
			where: { email }
		});

		// If user does not exist, return error
		if (!user) {
			throw new AppError('Invalid email or password', 401);
		}

		// Compare the provided password with the stored hashed password
		const isPasswordValid = await comparePassword(password, user.password);
		if (!isPasswordValid) {
			throw new AppError('Invalid email or password', 401);
		}

		// Generate access and refresh tokens using user details
		const payload = { id: user.id, email: user.email };
		const accessToken = generateAccessToken(payload);
		const refreshToken = generateRefreshToken(payload);

		// Store refresh token in database
		await db.session.create({
			data: {
				userId: user.id,
				refreshToken,
				userAgent: req.headers['user-agent'] || null
			}
		})
		// Set refresh token in HTTP-only cookie
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
		});


		return res.status(200).json({
			success: true,
			message: 'Login successfully',
			accessToken
		})

	} catch (error) {
		next(error);
	}
}

export const refreshTokenController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			throw new AppError('Refresh token required', 401);
		}

		// Verify the refresh token
		const decoded = verifyRefreshToken(refreshToken);
		if (!decoded) {
			throw new AppError('Invalid refresh token', 401);
		}

		// Check if the refresh token exists in the database and is valid
		const session = await db.session.findFirst({
			where: {
				refreshToken,
				isValid: true
			},
			include: {
				user: true
			}
		});

		if (!session) {
			throw new AppError('Invalid session', 401);
		}

		// Generate new tokens
		const payload = { id: session.user.id, email: session.user.email };
		const newAccessToken = generateAccessToken(payload);
		const newRefreshToken = generateRefreshToken(payload);

		// Update the session with the new refresh token
		await db.session.update({
			where: { id: session.id },
			data: {
				refreshToken: newRefreshToken
			}
		});

		// Set new refresh token in cookie
		res.cookie('refreshToken', newRefreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
		});

		return res.json({
			success: true,
			accessToken: newAccessToken
		});

	} catch (error) {
		next(error);
	}
};

export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (refreshToken) {
			// Invalidate the session
			await db.session.updateMany({
				where: {
					refreshToken,
					isValid: true
				},
				data: {
					isValid: false
				}
			});
		}

		// Clear the refresh token cookie
		res.clearCookie('refreshToken');

		return res.json({
			success: true,
			message: 'Logged out successfully'
		});

	} catch (error) {
		next(error);
	}
};