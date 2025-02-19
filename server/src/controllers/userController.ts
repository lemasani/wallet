import { Request, Response, NextFunction } from 'express';
import db from '../utils/db';
import {loginSchema, userSchema} from '../models/user';
import { AppError } from '../utils/AppError';
import {comparePassword, hashPassword} from '../utils/Encryption';

export const createUserController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
	try {
		const validateUser = userSchema.parse(req.body);
		const checkUser = await db.user.findUnique({
			where: { email: validateUser.email }
		});
		if (checkUser) {
			throw new AppError('User already exists', 409);
		}
		// Hash the password before saving
		const hashedPassword = await hashPassword(validateUser.password);
		
		// Save the user, replacing the plain password with the hashed one
		await db.user.create({
			data: {
				...validateUser,
				password: hashedPassword
			}
		});
		
		return res.status(200).json({
			success: true,
			message: 'User created successfully',
		});
	} catch (error) {
		next(error);
	}
};



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
		
		return res.status(200).json({
			success: true,
			message: 'Login successfully',
		})
		
	}catch (error) {
		next(error);
	}
}