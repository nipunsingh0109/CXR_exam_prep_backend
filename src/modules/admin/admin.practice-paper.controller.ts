import { Request, Response, NextFunction } from 'express';
import { extractTextFromPdf } from '../../utils/pdf-extractor';
import fs from 'fs';

export const adminPracticePaperController = {
  getPracticePapersByExam: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { examId } = req.params;
      const { prisma } = require('../../lib/prisma');
      const papers = await prisma.practicePaper.findMany({
        where: { examId },
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { questions: true }
          }
        }
      });
      res.status(200).json({ success: true, data: papers });
    } catch (error) {
      next(error);
    }
  },

  getPracticePaperById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { paperId } = req.params;
      const { prisma } = require('../../lib/prisma');
      const paper = await prisma.practicePaper.findUnique({
        where: { id: paperId },
        include: {
          questions: {
            orderBy: { createdAt: 'asc' }
          }
        }
      });
      if (!paper) {
        return res.status(404).json({ success: false, message: 'Practice paper not found' });
      }
      res.status(200).json({ success: true, data: paper });
    } catch (error) {
      next(error);
    }
  },

  updatePracticePaper: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { paperId } = req.params;
      const { title, description, questions, isActive } = req.body;

      if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Title and at least one question are required.'
        });
      }

      // Validate questions
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (typeof q.questionText !== 'string') {
          return res.status(400).json({ success: false, message: `Question ${i + 1} has invalid text.` });
        }
        if (!Array.isArray(q.options) || q.options.length === 0) {
          return res.status(400).json({ success: false, message: `Question ${i + 1} must have options.` });
        }
        if (typeof q.correctAnswer !== 'number' || isNaN(q.correctAnswer)) {
          return res.status(400).json({ success: false, message: `Question ${i + 1} has an invalid answer format.` });
        }
        if (!isActive && q.correctAnswer < 0) {
           // Allow negative numbers for drafts
        } else if (isActive && q.correctAnswer < 0) {
          return res.status(400).json({ success: false, message: `Question ${i + 1} must have a correct answer selected to publish.` });
        }
      }

      const { prisma } = require('../../lib/prisma');
      
      // Delete existing questions
      await prisma.practiceQuestion.deleteMany({
        where: { practicePaperId: paperId }
      });

      // Update paper and create new questions
      const updatedPaper = await prisma.practicePaper.update({
        where: { id: paperId },
        data: {
          title,
          description,
          isActive: isActive !== undefined ? isActive : true,
          questions: {
            create: questions.map((q: any) => ({
              questionText: q.questionText,
              options: q.options,
              correctAnswer: q.correctAnswer !== null ? q.correctAnswer : -1
            }))
          }
        },
        include: {
          questions: true
        }
      });

      res.status(200).json({
        success: true,
        message: 'Practice Paper updated successfully',
        data: updatedPaper
      });
    } catch (error: any) {
      console.error('Error updating practice paper:', error.message, error.stack);
      next(error);
    }
  },

  extractText: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No PDF file provided.'
        });
      }

      if (req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({
          success: false,
          message: 'Only PDF files are allowed.'
        });
      }

      // Read the file from disk because multer is using diskStorage
      const fileBuffer = await fs.promises.readFile(req.file.path);
      const extractedText = await extractTextFromPdf(fileBuffer);

      // Clean up the uploaded file to save space
      await fs.promises.unlink(req.file.path);

      res.status(200).json({
        success: true,
        data: { text: extractedText }
      });
    } catch (error) {
      next(error);
    }
  },

  createPracticePaper: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { examId } = req.params;
      const { title, description, questions, isActive } = req.body;

      if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Title and at least one question are required.'
        });
      }

      // Validate questions
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (typeof q.questionText !== 'string') {
          return res.status(400).json({ success: false, message: `Question ${i + 1} has invalid text.` });
        }
        if (!Array.isArray(q.options) || q.options.length === 0) {
          return res.status(400).json({ success: false, message: `Question ${i + 1} must have options.` });
        }
        if (typeof q.correctAnswer !== 'number' || isNaN(q.correctAnswer)) {
          return res.status(400).json({ success: false, message: `Question ${i + 1} has an invalid answer format.` });
        }
        if (!isActive && q.correctAnswer < 0) {
           // Allow negative numbers for drafts (unanswered)
        } else if (isActive && q.correctAnswer < 0) {
          return res.status(400).json({ success: false, message: `Question ${i + 1} must have a correct answer selected to publish.` });
        }
      }

      // Check if the exam exists
      const { prisma } = require('../../lib/prisma');
      const exam = await prisma.exam.findUnique({ where: { id: examId } });
      
      if (!exam) {
        return res.status(404).json({ success: false, message: 'Exam not found.' });
      }

      const practicePaper = await prisma.practicePaper.create({
        data: {
          examId,
          title,
          description,
          isActive: isActive !== undefined ? isActive : true,
          questions: {
            create: questions.map((q: any) => ({
              questionText: q.questionText,
              options: q.options,
              correctAnswer: q.correctAnswer !== null ? q.correctAnswer : -1
            }))
          }
        },
        include: {
          questions: true
        }
      });

      res.status(201).json({
        success: true,
        message: 'Practice Paper created successfully',
        data: practicePaper
      });
    } catch (error: any) {
      console.error('Error creating practice paper:', error.message, error.stack);
      next(error);
    }
  }
};
