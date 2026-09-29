import { prisma } from '../../lib/prisma';

export const pyqRepository = {
  findByExamIdActive: async (examId: string) => {
    return prisma.pyq.findMany({
      where: { examId, isActive: true },
      orderBy: { year: 'desc' },
      select: {
        id: true,
        title: true,
        year: true,
        fileName: true,
        fileSize: true,
      }
    });
  },

  findByIdActive: async (id: string) => {
    return prisma.pyq.findFirst({
      where: { id, isActive: true },
      include: {
        exam: {
          select: { isActive: true }
        }
      }
    });
  },
};
