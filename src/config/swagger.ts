import swaggerJSDoc, { SwaggerDefinition } from "swagger-jsdoc";

const SwaggerDefinition: SwaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: "Authentication & AI Chat API",
        version: '1.0.0',
        description: `
            A comprehensive authentication and AI chat API built with Express.js.
            
            This API demonstrates:
            - JWT-based authentication
            - Role-based access control
            - AI chat integration with Vercel AI SDK
            - Protected API endpoints
            - Complete OpenAPI documentation
            
            ## Authentication Flow
            1. Register or login with username/password
            2. Receive JWT token in response and cookie
            3. Use token in Authorization header: \`Bearer <token>\`
            4. Access protected endpoints with valid token
            
            ## Available Users (for testing)
            - **admin** / **admin123** (role: admin)
            - **user** / **user123** (role: basic)
        `,
        contact: {
            name: "Graslowsnail",
            url: 'https://github.com/graslowsnail'
        },
        license: {
            name: "MIT",
            url: 'https://opensource.org/licenses/MIT',
        },
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Development server',
        },
        {
            url: 'https://your-production-url.com',
            description: 'Production server (update with your actual URL)',
        },
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                description: 'Enter your admin secret (admin-secret-123)',
            },
        },
    },
    tags: [
        {
            name: 'Authentication',
            description: 'User authentication and authorization',
        },
        {
            name: 'Public',
            description: 'Public endpoints (no authentication required)',
        },
        {
            name: 'Protected',
            description: 'Protected endpoints (authentication required)',
        },
        {
            name: 'AI Chat',
            description: 'AI chat endpoints using Vercel AI SDK',
        },
        {
            name: 'User Management',
            description: 'User profile and management endpoints',
        },
    ],
};

const swaggerOptions = {
    definition: SwaggerDefinition,
    apis: [
        './src/routes/*.ts',  // Instead of './src/index.ts'
        './src/index.ts',
    ]
}

export const swaggerSpec = swaggerJSDoc(swaggerOptions)

// Helper function to generate example JWT token for documentation
export const generateExampleJWT = (): string => {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDQwNjcyMDAsImV4cCI6MTcwNDA3MDgwMH0.example';
};
