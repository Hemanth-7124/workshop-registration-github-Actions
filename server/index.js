import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import registrationRoutes from './routes/registration.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;



// Middleware
const allowedOrigins = [
  'http://localhost',
  'http://127.0.0.1',
  'http://15.207.147.198:3000',

];

// Add additional origins from environment variable if provided
if (process.env.CORS_ORIGIN) {
  const envOrigins = process.env.CORS_ORIGIN.split(',').map(origin => origin.trim());
  allowedOrigins.push(...envOrigins);
}

// ✅ Updated: dynamic origin check to allow localhost with any port
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow Postman, mobile, etc.

    // Allow any localhost or 127.0.0.1 port
    if (
      allowedOrigins.some(base =>
        origin.startsWith(base)
      ) ||
      process.env.NODE_ENV === 'development'
    ) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', registrationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Something went wrong!'
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});

export default { app, server };
