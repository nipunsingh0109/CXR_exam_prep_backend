import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { env } from '../../config/env';
import { BadRequestError } from '../../utils/errors';

const prisma = new PrismaClient();

export const adminAuthService = {
  login: async (email: string, password: string) => {
    // Fetch admin from db
    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      throw new BadRequestError('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    
    if (!isPasswordValid) {
      throw new BadRequestError('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      env.JWT_SECRET || 'fallback-secret-key-for-dev',
      { expiresIn: '24h' }
    );

    return {
      user: { id: admin.id, name: admin.name, email: admin.email },
      token
    };
  }
};
