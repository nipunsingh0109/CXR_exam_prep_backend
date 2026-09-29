import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { env } from '../config/env';
import { apiRoutes } from './routes';
import { errorMiddleware } from '../middleware/error.middleware';
import { globalRateLimiter } from '../middleware/rate-limit.middleware';

export const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Parsers
app.use(express.json({ limit: '10mb' })); // Body limit
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Apply rate limiting
app.use('/api', globalRateLimiter);

// Serve uploads statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api', apiRoutes);

// Global Error Handler
app.use(errorMiddleware);
