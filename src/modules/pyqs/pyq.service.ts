import { pyqRepository } from './pyq.repository';
import { NotFoundError, BadRequestError } from '../../utils/errors';
import { storage } from '../../lib/storage';

export const pyqService = {
  getPyqsByExamId: async (examId: string) => {
    return pyqRepository.findByExamIdActive(examId);
  },

  getPyqById: async (id: string) => {
    const pyq = await pyqRepository.findByIdActive(id);
    if (!pyq || !pyq.exam.isActive) {
      throw new NotFoundError('PYQ not found or inactive');
    }
    
    // Omit sensitive data if necessary, return metadata
    return {
      id: pyq.id,
      examId: pyq.examId,
      title: pyq.title,
      year: pyq.year,
      fileName: pyq.fileName,
      fileSize: pyq.fileSize,
    };
  },

  getPyqAccessUrl: async (id: string) => {
    const pyq = await pyqRepository.findByIdActive(id);
    if (!pyq || !pyq.exam.isActive) {
      throw new NotFoundError('PYQ not found or inactive');
    }

    // Generate secure signed URL for viewing or downloading
    const accessUrl = await storage.getSignedUrl(pyq.fileUrl);
    
    return {
      url: accessUrl,
      fileName: pyq.fileName
    };
  }
};
