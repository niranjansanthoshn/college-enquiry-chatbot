const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config/env');
const { apiLimiter } = require('./middleware/rateLimiter');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const collegeInfoRoutes = require('./routes/collegeInfoRoutes');
const faqRoutes = require('./routes/faqRoutes');
const chatRoutes = require('./routes/chatRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Trust reverse proxy (Render, Cloudflare, Vercel)
app.set('trust proxy', 1);

// Security Middlewares
app.use(helmet());

// CORS Configuration
const allowedOrigins = [
  config.frontendUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      // or origins in allowed list, or *.vercel.app, or dev localhost
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        config.nodeEnv === 'development' ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost')
      ) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy: Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Logging
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Body parsing with size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Global rate limiting
app.use('/api/', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    uptime: Math.floor(process.uptime()),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    aiProvider: config.aiProvider,
    hasGeminiKey: Boolean(config.geminiApiKey && config.geminiApiKey !== 'your_gemini_api_key_here'),
    environment: config.nodeEnv
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/college-info', collegeInfoRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/admin', adminRoutes);

// 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
