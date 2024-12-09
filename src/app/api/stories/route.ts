import { getAuthUser } from '@/lib/auth/utils';
import { storyService } from '@/lib/services/story';
import { CreateStoryInput } from '@/types/story';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema
const createStorySchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().optional(),
  genre: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const input = createStorySchema.parse(body) as CreateStoryInput;

    const story = await storyService.createStory(user.id, input);
    return NextResponse.json(story, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Create story error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET stories with pagination and filters
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const genre = searchParams.get('genre');
    
    const where = {
      published: true,
      ...(genre && { genre }),
    };

    const result = await storyService.listStories(page, limit, where);
    return NextResponse.json(result);
  } catch (error) {
    console.error('List stories error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 