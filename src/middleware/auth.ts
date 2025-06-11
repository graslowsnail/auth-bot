import { findUserBySecret } from "../config/database";

export const authenticateSecret = (req, res, next) => {
    console.log('🔐 [AUTH] Using secret-based authentication (educational demo)');

    // Check Authorization header for Bearer token
    const authHeader = req.headers['authorization'];
    let secret = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        secret = authHeader.substring(7); // Remove 'Bearer ' prefix
    }

    if (!secret) {
        res.status(401).json({
            success: false,
            error: 'Access denied. No secret provided.',
            message: 'Provide secret in Authorization header (Bearer <secret>)'
        });
        return;
    }

    // Find user by secret
    const user = findUserBySecret(secret);
    if (!user) {
        res.status(401).json({
            success: false,
            error: 'Invalid secret',
            message: 'Secret not recognized'
        });
        return;
    }

    // Attach user to request
    req.user = user;
    console.log(`✅ [AUTH] User authenticated: ${user.username} (${user.role})`);
    next();
};

export const requireAdmin = (req, res, next) => {
    const user = req.user;
    
    if (!user || user.role !== 'admin') {
        res.status(403).json({
            success: false,
            error: 'Admin access required',
            message: 'You must be an admin to access this resource'
        });
        return;
    }
    
    console.log(`👑 [AUTH] Admin access granted to: ${req.user.username}`);
    next();
};

export const requireAuth = (req, res, next) => {
    if(!req.user) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required',
            message: "You must be logged in to access this resource"
        })
    }

    console.log(`🔓 [AUTH] Authenticated access granted to: ${req.user.username} (${req.user.role})`);
    next();
}