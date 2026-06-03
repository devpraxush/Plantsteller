import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export interface TokenPayload {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwtSecret as string, {
    expiresIn: config.jwtExpire,
  } as any);
};

export const verifyTokenPayload = (token: string): TokenPayload => {
  const decoded = jwt.verify(token, config.jwtSecret) as TokenPayload;
  return decoded;
};

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.decode(token) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
};
