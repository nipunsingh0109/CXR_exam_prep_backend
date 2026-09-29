import { prisma } from '../../lib/prisma';

export const tutorialRepository = {
  findByExamIdActive: async (examId: string) => {
    return prisma.tutorial.findMany({
      where: { examId, isActive: true },
      orderBy: { year: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        youtubeUrl: true,
        youtubeVideoId: true,
        thumbnailUrl: true,
        year: true,
      }
    });
  },

  create: async (data: { examId: string; title: string; description?: string; youtubeUrl: string; youtubeVideoId: string; thumbnailUrl: string; year?: number }) => {
    return prisma.tutorial.create({
      data: {
        ...data,
        isActive: true, // Make it active immediately based on requirements
      }
    });
  }
};
