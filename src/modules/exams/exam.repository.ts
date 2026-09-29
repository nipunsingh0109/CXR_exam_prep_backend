import { prisma } from '../../lib/prisma';

export const examRepository = {
  findAllActive: async () => {
    return prisma.exam.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  },

  findByIdActive: async (id: string) => {
    return prisma.exam.findFirst({
      where: { id, isActive: true },
    });
  },
};
