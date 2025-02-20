import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';

const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET || 'access_secret';
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret';

// Define a type for the token payload
interface TokenPayload {
  id: string;
  email: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  
  const options: SignOptions = {
  // @ts-ignore
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN!
  };
  return jwt.sign(payload, accessTokenSecret, options);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    // @ts-ignore
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN!
  };
  return jwt.sign(payload, refreshTokenSecret, options);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, accessTokenSecret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, refreshTokenSecret) as JwtPayload;
};