import {NextFunction, Request, Response} from 'express';
import {loginSchema} from '../models/user';
import db from '../utils/db';
import {AppError} from '../utils/AppError';
import {comparePassword} from '../utils/Encryption';
import {generateAccessToken, generateRefreshToken} from '../utils/jwt';


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
		
		return res.status(200).json({
			success: true,
			message: 'Login successfully',
			accessToken
		})
		
	}catch (error) {
		next(error);
	}
}