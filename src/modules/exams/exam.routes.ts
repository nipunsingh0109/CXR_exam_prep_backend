import { Router } from 'express';
import { examController } from './exam.controller';
import { validate } from '../../middleware/validation.middleware';
import { getExamParamsSchema, addTutorialSchema } from './exam.schema';

export const examRoutes = Router();

examRoutes.get('/', examController.getExams);
examRoutes.get('/:examId', validate(getExamParamsSchema), examController.getExamById);
examRoutes.get('/:examId/pyqs', validate(getExamParamsSchema), examController.getExamPyqs);
examRoutes.get('/:examId/tutorials', validate(getExamParamsSchema), examController.getExamTutorials);
examRoutes.post('/:examId/tutorials', validate(addTutorialSchema), examController.addTutorial);
examRoutes.get('/:examId/practice-papers', validate(getExamParamsSchema), examController.getExamPracticePapers);
examRoutes.get('/:examId/practice-papers/:paperId', examController.getPracticePaperById);
