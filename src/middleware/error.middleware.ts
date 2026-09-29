import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/api-response';
import { logger } from '../utils/logger';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);

  if (err instanceof AppError) {
    return sendError(res, err.message, err.code, err.statusCode);
  }

  return sendError(res, 'Internal Server Error', 'INTERNAL_ERROR', 500);
};
