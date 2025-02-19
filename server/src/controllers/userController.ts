import { Request, Response, NextFunction } from 'express';
import db from '../utils/db';
import { userSchema} from '../models/user';
import { AppError } from '../utils/AppError';
import { hashPassword} from '../utils/Encryption';

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


