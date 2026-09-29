import { z } from 'zod';

export const getExamParamsSchema = z.object({
  params: z.object({
    examId: z.string().uuid('Invalid exam ID format'),
  }),
});

export const addTutorialSchema = z.object({
  params: z.object({
    examId: z.string().uuid('Invalid exam ID format'),
  }),
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    youtubeUrl: z.string().url('Must be a valid URL').includes('youtube.com', { message: 'Must be a YouTube link' }).or(z.string().url().includes('youtu.be')),
    year: z.number().int().optional(),
    description: z.string().optional(),
  }),
});
