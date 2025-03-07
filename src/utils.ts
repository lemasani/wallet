
import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
	const saltRounds =parseInt(process.env.SALT_ROUNDS!);
	const salt = await bcrypt.genSalt(saltRounds);
	
	return bcrypt.hash(password, salt);
};


export const comparePassword = async (password: string, hashPassworded:string): Promise<boolean> => {
	return await bcrypt.compare(password, hashPassworded);
}
