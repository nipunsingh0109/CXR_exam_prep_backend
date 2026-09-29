import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import slugify from 'slugify';

export const adminExamController = {
  createExam: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description } = req.body;
      
      const slug = slugify(name, { lower: true, strict: true });
      
      const existingExam = await prisma.exam.findUnique({
        where: { slug }
      });

      if (existingExam) {
        return res.status(400).json({
          success: false,
          error: 'An exam with a similar name already exists.'
        });
      }

      const exam = await prisma.exam.create({
        data: {
          name,
          slug,
          description,
          logoUrl: 'https://via.placeholder.com/150?text=Exam', // Default logo
          isActive: true
        }
      });

      res.status(201).json({
        success: true,
        data: exam
      });
    } catch (error) {
      next(error);
    }
  },

  getExams: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const exams = await prisma.exam.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { pyqs: true, tutorials: true }
          }
        }
      });

      // Transform for frontend
      const formattedExams = exams.map(exam => ({
        id: exam.id,
        name: exam.name,
        slug: exam.slug,
        description: exam.description,
        logoUrl: exam.logoUrl,
        isActive: exam.isActive,
        pyqCount: exam._count.pyqs,
        tutorialCount: exam._count.tutorials,
        createdAt: exam.createdAt,
      }));

      res.status(200).json({
        success: true,
        data: formattedExams
      });
    } catch (error) {
      next(error);
    }
  }
};
