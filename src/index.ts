import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from 'swagger-ui-express'

import { swaggerSpec } from "./config/swagger";
import { authenticateSecret, requireAdmin } from "./middleware/auth"; 
import { ApiResponse } from "./types";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3000",
          ]
        : ["https://your-production-domain.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development'
        },
        message: 'Server is running'
    });
});

// API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec,{
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Auth & AI Chat API Documentation',
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        defaultModelRendering: 'model',
    }
}));

// Serve OpenAPI spec as JSON
app.get("/api-docs.json", (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
})

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Authentication & AI Chat API Server',
        documentation: '/api-docs (coming soon)',
        health: '/health'
    });
});

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
app.get('/api/public', (req, res) => {
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
app.get('/api/protected', authenticateSecret, requireAdmin, (req, res) => {
    res.json({
        success: true,
        data: {
            message: 'only admin should be able to see this',
            user: (req as any).user?.username,
            role: (req as any).user?.role,
            secretData: 'this is confidential admin information'
        },
        message: 'Only admin should be able to see this',
    });
});

//API Routes
//app.use('/api', authRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`
    🚀 Authentication & AI Chat API Server Started!

    📍 Server running on: http://localhost:${PORT}
    📚 API Documentation: http://localhost:${PORT}/api-docs
    🏥 Health Check: http://localhost:${PORT}/health
    🌍 Environment: ${process.env.NODE_ENV || "development"}

    📋 Quick Test:
    curl http://localhost:${PORT}/api/public

    🔐 Test Users:
    Admin: username="admin", password="admin123"
    User:  username="user", password="user123"

    💡 Next Steps:
    1. Visit http://localhost:${PORT}/api-docs
    2. Try the login endpoint with test credentials
    3. Use the JWT token to access protected endpoints
    4. Add your OpenAI API key to test AI chat features

    🔧 Configuration:
    ${
        process.env.OPENAI_API_KEY
        ? "✅ OpenAI API Key configured"
        : "⚠️  OpenAI API Key missing (add to .env)"
    }
    ${
        process.env.JWT_SECRET
        ? "✅ JWT Secret configured"
        : "⚠️  Using fallback JWT secret (add to .env)"
    }`
  );

  console.log("🎯 [STARTUP] All systems ready!");
});
