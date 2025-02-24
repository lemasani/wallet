import {z} from 'zod';


export const createWalletAccountSchema = z.object({
	name: z.string().min(3, 'At least 3 characters long'),
})