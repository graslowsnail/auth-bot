import jwt from 'jsonwebtoken'
import { User } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '1h';

/**
 * Sign a JWT token with user information
 */
export interface JWTPayload {
    userId: number;
    username: string;
    role: 'admin' | 'basic';
    iat?: number;  // issued at (JWT adds automatically)
    exp?: number;  // expires (JWT adds automatically)
}

export const signJWT = (user: User): string => {
    const payload: JWTPayload = {
        userId: user.id,
        username: user.username,
        role: user.role,
    };

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'auth-api-example',
        audience: 'auth-api-users'
    } as jwt.SignOptions)
};

/**
 * Verify and decode a JWT token
 */
export const verifyJWT = (token: string) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            issuer: 'auth-api-example',
            audience: 'auth-api-users'
        } as jwt.VerifyOptions)
        
        return decoded
    } catch (error) {
        // Token is invalid, expired, or malformed
        console.error('JWT verification failed:', error);
        return null;
        
    }
}