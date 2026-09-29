import { tutorialRepository } from './tutorial.repository';

export const tutorialService = {
  getTutorialsByExamId: async (examId: string) => {
    return tutorialRepository.findByExamIdActive(examId);
  },

  addTutorial: async (examId: string, data: { title: string; youtubeUrl: string; description?: string; year?: number }) => {
    // Parse YouTube Video ID from standard formats
    let videoId = '';
    const url = new URL(data.youtubeUrl);
    
    if (url.hostname.includes('youtube.com')) {
      videoId = url.searchParams.get('v') || '';
    } else if (url.hostname.includes('youtu.be')) {
      videoId = url.pathname.slice(1);
    }

    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    return tutorialRepository.create({
      examId,
      title: data.title,
      description: data.description,
      youtubeUrl: data.youtubeUrl,
      youtubeVideoId: videoId,
      thumbnailUrl,
      year: data.year,
    });
  }
};
