import { Router } from 'express';
import { pyqController } from './pyq.controller';
import { validate } from '../../middleware/validation.middleware';
import { getPyqParamsSchema } from './pyq.schema';

export const pyqRoutes = Router();

pyqRoutes.get('/:pyqId', validate(getPyqParamsSchema), pyqController.getPyqById);
pyqRoutes.get('/:pyqId/view', validate(getPyqParamsSchema), pyqController.viewPyq);
pyqRoutes.get('/:pyqId/download', validate(getPyqParamsSchema), pyqController.downloadPyq);
