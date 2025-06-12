import { Request } from 'express';


export interface User {
    id: number;
    username: string;
    password: string;
    role: 'admin' | 'basic';
    secret: string;
    createdAt: Date;
}

export interface AuthenticatedRequest extends Request {
    user?: User;
}

export interface ApiResponse < T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
