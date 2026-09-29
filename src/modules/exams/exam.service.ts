import { examRepository } from './exam.repository';
import { NotFoundError } from '../../utils/errors';

export const examService = {
  getAllExams: async () => {
    return examRepository.findAllActive();
  },

  getExamById: async (id: string) => {
    const exam = await examRepository.findByIdActive(id);
    if (!exam) {
      throw new NotFoundError('Exam not found');
    }
    return exam;
  },
};
