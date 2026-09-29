import { Request, Response, NextFunction } from 'express';
import { pyqService } from './pyq.service';
import { sendSuccess } from '../../utils/api-response';

export const pyqController = {
  getPyqById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pyqId } = req.params;
      const pyq = await pyqService.getPyqById(pyqId);
      sendSuccess(res, pyq, 'PYQ metadata retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  viewPyq: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pyqId } = req.params;
      const accessInfo = await pyqService.getPyqAccessUrl(pyqId);
      // Depending on requirement, we could either redirect directly or return the URL to the frontend
      sendSuccess(res, { url: accessInfo.url }, 'View access granted');
    } catch (error) {
      next(error);
    }
  },

  downloadPyq: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pyqId } = req.params;
      const accessInfo = await pyqService.getPyqAccessUrl(pyqId);
      sendSuccess(res, { url: accessInfo.url, fileName: accessInfo.fileName }, 'Download access granted');
    } catch (error) {
      next(error);
    }
  }
};
