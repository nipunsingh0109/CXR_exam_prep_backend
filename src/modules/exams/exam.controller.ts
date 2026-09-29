import { Request, Response, NextFunction } from 'express';
import { examService } from './exam.service';
import { sendSuccess } from '../../utils/api-response';
import { pyqService } from '../pyqs/pyq.service';
import { tutorialService } from '../tutorials/tutorial.service';

export const examController = {
  getExams: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const exams = await examService.getAllExams();
      sendSuccess(res, exams, 'Exams retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  getExamById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const examId = req.params.examId as string;
      const exam = await examService.getExamById(examId);
      sendSuccess(res, exam, 'Exam retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  getExamPyqs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const examId = req.params.examId as string;
      const exam = await examService.getExamById(examId);
      const papers = await pyqService.getPyqsByExamId(examId);
      
      sendSuccess(res, { exam, papers }, 'PYQs retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  getExamTutorials: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const examId = req.params.examId as string;
      const exam = await examService.getExamById(examId);
      const tutorials = await tutorialService.getTutorialsByExamId(examId);
      
      sendSuccess(res, { exam, tutorials }, 'Tutorials retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  addTutorial: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const examId = req.params.examId as string;
      const data = req.body;
      const newTutorial = await tutorialService.addTutorial(examId, data);
      sendSuccess(res, newTutorial, 'Tutorial added successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  getExamPracticePapers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const examId = req.params.examId as string;
      const { prisma } = require('../../lib/prisma');
      const papers = await prisma.practicePaper.findMany({
        where: { examId, isActive: true },
        orderBy: { createdAt: 'desc' }
      });
      sendSuccess(res, papers, 'Practice papers retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  getPracticePaperById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paperId = req.params.paperId as string;
      const { prisma } = require('../../lib/prisma');
      const paper = await prisma.practicePaper.findUnique({
        where: { id: paperId, isActive: true },
        include: { questions: true }
      });
      if (!paper) {
        return res.status(404).json({ success: false, message: 'Practice paper not found' });
      }
      sendSuccess(res, paper, 'Practice paper retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
};
