import { Response, Request, NextFunction } from 'express';
import { createWalletAccountSchema } from '../models/walletAccount';
import db from '../utils/db';
import { AppError } from '../utils/AppError';

export const createWalletAccount = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const validate = createWalletAccountSchema.parse(req.body);
		const checkWallet = await db.account.findFirst({
			where: {
				name: validate.name,
				userId: req.user?.id
			}
		});

		if (checkWallet) {
			throw new AppError('Account with this name already exists', 400);
		}

		const account = await db.account.create({
			data: {
				name: validate.name,
				userId: req.user!.id,
				balance: 0
			}
		});

		res.status(201).json({
			success: true,
			message: 'Account created successfully',
			data: account
		});
	} catch (err) {
		next(err);
	}
}