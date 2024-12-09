import { db } from '@/lib/db';
import { CreateStoryInput, UpdateStoryInput } from '@/types/story';

export const storyService = {
  // Create a new story
  async createStory(authorId: string, input: CreateStoryInput) {
    return db.story.create({
      data: {
        ...input,
        authorId,
        tags: input.tags || [],
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        chapters: true,
      },
    });
  },

  // Get story by ID
  async getStory(id: string) {
    return db.story.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        chapters: {
          include: {
            choices: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  },

  // Update story
  async updateStory(id: string, authorId: string, input: UpdateStoryInput) {
    return db.story.update({
      where: {
        id,
        authorId, // Ensure the user is the author
      },
      data: input,
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        chapters: true,
      },
    });
  },

  // Delete story
  async deleteStory(id: string, authorId: string) {
    return db.story.delete({
      where: {
        id,
        authorId, // Ensure the user is the author
      },
    });
  },

  // List stories with pagination
  async listStories(page = 1, limit = 10, where = {}) {
    const skip = (page - 1) * limit;
    
    const [stories, total] = await Promise.all([
      db.story.findMany({
        where,
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      db.story.count({ where }),
    ]);

    return {
      stories,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },
}; 