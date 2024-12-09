export interface Story {
  id: string;
  title: string;
  description?: string;
  authorId: string;
  author: {
    id: string;
    username: string;
  };
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  chapters: Chapter[];
  genre?: string;
  tags: string[];
  views: number;
  rating?: number;
  ratingCount: number;
}

export interface Chapter {
  id: string;
  storyId: string;
  title: string;
  content: string;
  choices: Choice[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Choice {
  id: string;
  chapterId: string;
  text: string;
  nextChapterId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStoryInput {
  title: string;
  description?: string;
  genre?: string;
  tags?: string[];
}

export interface UpdateStoryInput extends Partial<CreateStoryInput> {
  published?: boolean;
} 