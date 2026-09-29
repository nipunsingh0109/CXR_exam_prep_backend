import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { sendSuccess } from '../../utils/api-response';

import { AppError } from '../../utils/errors';

// Basic youtube url parser to get video ID
const getYoutubeVideoId = (url: string) => {
  if (url.length === 11) return url;
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : '';
};

export const adminTutorialController = {
  getTutorialsByExam: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const examId = req.params.examId as string;
      const tutorials = await prisma.tutorial.findMany({
        where: { examId },
        orderBy: { year: 'desc' }
      });
      sendSuccess(res, tutorials, 'Tutorials retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  createTutorial: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const examId = req.params.examId as string;
      const { title, description, youtubeUrl, year, isActive } = req.body;
      
      if (!youtubeUrl) {
        throw new AppError('YouTube URL is required', 400);
      }

      const youtubeVideoId = getYoutubeVideoId(youtubeUrl);
      if (!youtubeVideoId) {
        throw new AppError('Invalid YouTube URL. Please use a standard watch link.', 400);
      }
      
      const thumbnailUrl = `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;

      const tutorial = await prisma.tutorial.create({
        data: {
          examId,
          title,
          description,
          youtubeUrl,
          youtubeVideoId,
          thumbnailUrl,
          year: year ? parseInt(year) : null,
          isActive: isActive === 'true' || isActive === true
        }
      });

      sendSuccess(res, tutorial, 'Tutorial created successfully', 201);
    } catch (error) {
      console.error("Tutorial create error:", error);
      next(error);
    }
  }
};
