import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { sendSuccess } from '../../utils/api-response';

import { AppError } from '../../utils/errors';

export const adminPyqController = {
  getPyqsByExam: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const examId = req.params.examId as string;
      const pyqs = await prisma.pyq.findMany({
        where: { examId },
        orderBy: { year: 'desc' }
      });
      sendSuccess(res, pyqs, 'PYQs retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  createPyq: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const examId = req.params.examId as string;
      const { title, year, isActive, link } = req.body;
      
      const file = req.file;
      if (!file && !link) {
        throw new AppError('PDF file or link is required', 400);
      }
      
      const parsedYear = parseInt(year);
      if (isNaN(parsedYear)) {
        throw new AppError('Year must be a valid number', 400);
      }

      let fileUrl = '';
      let fileName = '';
      let fileSize = null;
      let mimeType = null;

      if (file) {
        fileUrl = `/uploads/${file.filename}`;
        fileName = file.originalname;
        fileSize = file.size;
        mimeType = file.mimetype;
      } else if (link) {
        fileUrl = link;
        fileName = title;
      }

      const pyq = await prisma.pyq.create({
        data: {
          examId,
          title,
          year: parsedYear,
          fileUrl,
          fileName,
          fileSize,
          mimeType,
          isActive: isActive === 'true' || isActive === true
        }
      });

      sendSuccess(res, pyq, 'PYQ created successfully', 201);
    } catch (error) {
      console.error("PYQ create error:", error);
      next(error);
    }
  }
};
