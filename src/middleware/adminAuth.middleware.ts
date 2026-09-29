import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.admin_token;

    // TEMP BYPASS
    if (req.path.includes('/practice-papers')) {
      return next();
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.',
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, env.JWT_SECRET || 'fallback-secret-key-for-dev') as { id: string };
      
      // Fetch admin from database
      const admin = await prisma.admin.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true } // Don't return password hash
      });

      if (!admin) {
        res.clearCookie('admin_token');
        return res.status(401).json({
          success: false,
          message: 'Admin account not found.',
        });
      }

      // Attach admin to request
      (req as any).admin = admin;
      next();
    } catch (err) {
      res.clearCookie('admin_token');
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.',
      });
    }
  } catch (error) {
    next(error);
  }
};
