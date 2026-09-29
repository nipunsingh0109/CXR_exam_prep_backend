import { Request, Response, NextFunction } from 'express';
import { adminAuthService } from './admin.auth.service';
import { sendSuccess } from '../../utils/api-response';

export const adminAuthController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const { user, token } = await adminAuthService.login(email, password);
      
      res.cookie('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      sendSuccess(res, { user }, 'Login successful');
    } catch (error) {
      next(error);
    }
  },

  logout: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie('admin_token');
      sendSuccess(res, null, 'Logout successful');
    } catch (error) {
      next(error);
    }
  },

  me: (req: Request, res: Response, next: NextFunction) => {
    try {
      // req.admin will be populated by auth middleware
      const admin = (req as any).admin;
      sendSuccess(res, { user: admin }, 'Current admin profile');
    } catch (error) {
      next(error);
    }
  }
};
