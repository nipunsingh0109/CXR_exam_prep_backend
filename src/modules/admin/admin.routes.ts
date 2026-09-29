import { Router } from 'express';
import { adminAuthController } from './admin.auth.controller';
import { adminExamController } from './admin.exam.controller';
import { validate } from '../../middleware/validation.middleware';
import { loginSchema, createExamSchema } from './admin.schema';
import { adminAuthMiddleware } from '../../middleware/adminAuth.middleware';
import { adminPyqController } from './admin.pyq.controller';
import { adminTutorialController } from './admin.tutorial.controller';
import { upload } from '../../middleware/upload.middleware';
import { authRateLimiter } from '../../middleware/rate-limit.middleware';
import { adminPracticePaperController } from './admin.practice-paper.controller';

export const adminRoutes = Router();

// Auth Routes (Public)
adminRoutes.post('/auth/login', authRateLimiter, validate(loginSchema), adminAuthController.login);
adminRoutes.post('/auth/logout', adminAuthController.logout);

// Apply auth middleware to all routes below this line
adminRoutes.use(adminAuthMiddleware);

adminRoutes.get('/auth/me', adminAuthController.me);

// Exam Routes
adminRoutes.get('/exams', adminExamController.getExams);
adminRoutes.post('/exams', validate(createExamSchema), adminExamController.createExam);

// PYQ Routes
adminRoutes.get('/exams/:examId/pyqs', adminPyqController.getPyqsByExam);
adminRoutes.post('/exams/:examId/pyqs', upload.single('file'), adminPyqController.createPyq);

// Tutorial Routes
adminRoutes.get('/exams/:examId/tutorials', adminTutorialController.getTutorialsByExam);
adminRoutes.post('/exams/:examId/tutorials', adminTutorialController.createTutorial);

// Practice Paper Routes
adminRoutes.get('/exams/:examId/practice-papers', adminPracticePaperController.getPracticePapersByExam);
adminRoutes.get('/practice-papers/:paperId', adminPracticePaperController.getPracticePaperById);
adminRoutes.put('/practice-papers/:paperId', adminPracticePaperController.updatePracticePaper);
adminRoutes.post('/practice-papers/extract', upload.single('file'), adminPracticePaperController.extractText);
adminRoutes.post('/exams/:examId/practice-papers', adminPracticePaperController.createPracticePaper);
