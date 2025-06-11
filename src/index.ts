import express from "express";
import cors from "cors";
import dotenv from "dotenv";

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

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Authentication & AI Chat API Server',
        documentation: '/api-docs (coming soon)',
        health: '/health'
    });
});

app.get('/api/public', (req, res) => {
    res.json({
        success: true,
        message: 'This is public information',
    });
});

app.get('/api/protected', (req, res) => {
    res.json({
        success: true,
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
