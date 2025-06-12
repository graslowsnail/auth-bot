import { Router } from "express";
import { signJWT } from "../utils/jwt";
import { findByUsername } from "../config/database";
import { authenticateSecret, authenticateToken, requireAdmin } from "../middleware/auth"; 

const router = Router();

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with username and password, returns JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "admin"
 *                 description: User's username
 *               password:
 *                 type: string
 *                 example: "admin123"
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                       description: JWT authentication token
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         username:
 *                           type: string
 *                           example: "admin"
 *                         role:
 *                           type: string
 *                           example: "admin"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *       400:
 *         description: Validation failed - missing username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Validation failed"
 *                 message:
 *                   type: string
 *                   example: "Username and password are required"
 *       401:
 *         description: Authentication failed - invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Authentication failed"
 *                 message:
 *                   type: string
 *                   example: "Invalid username or password"
 */
router.post('/login', (req, res) => {
    console.log('🔐 [LOGIN] Attempting login...');

    const { username, password } = req.body;

    //Validate input
    if(!username || !password) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            message: 'Username and password are required'
        })
    }

    // Find user
    const user = findByUsername(username);
    if(!user || user.password !== password) {
        console.log(`❌ [LOGIN] Failed login attempt for username: ${username}`);
        return res.status(401).json({
            success: false,
            error: 'Authentication failed',
            message: 'Invalid username or password'
        })
    }

    const token = signJWT(user);

    // Set cookies (HttpOnly for security)
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60, // 1hr
    });

    console.log(`✅ [LOGIN] Successful login: ${user.username} (${user.role})`);

    // Return successful response
    const response = {
        token,
        user: {
            id: user.id,
            username: user.username,
            role: user.role,
            createdAt: user.createdAt
        },
        message: 'Login successful'
    }

    res.json({
        success: true,
        data: response,
        message: 'Login successful'
    })

})

/**
 * @swagger
 * /api/public:
 *   get:
 *     summary: Get public information
 *     description: Returns public information that anyone can access
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: Public information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "This is public information"
 */
router.get('/public', (req, res) => {
    res.json({
        success: true,
        message: 'This is public information',
    });
});

/**
 * @swagger
 * /api/protected:
 *   get:
 *     summary: Get protected information (NOW ACTUALLY PROTECTED!)
 *     description: Returns admin-only information. Requires admin secret in Authorization header.
 *     tags: [Protected]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Protected information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Only admin should be able to see this"
 *       401:
 *         description: Unauthorized - No secret provided or invalid secret
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Access denied"
 */
router.get('/protected', authenticateToken, requireAdmin, (req, res) => {
    const user = (req as any).user;
    res.json({
        success: true,
        data: {
            message: 'only admin should be able to see this',
            user: user?.username,
            role: user?.role,
            secretData: 'this is confidential admin information'
        },
        message: 'Only admin should be able to see this',
    });
});

export default router;

