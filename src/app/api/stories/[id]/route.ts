import { getAuthUser } from '@/lib/auth/utils';
import { storyService } from '@/lib/services/story';
import { UpdateStoryInput } from '@/types/story';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema
const updateStorySchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  genre: z.string().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const story = await storyService.getStory(params.id);
    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }
    return NextResponse.json(story);
  } catch (error) {
    console.error('Get story error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const input = updateStorySchema.parse(body) as UpdateStoryInput;

    const story = await storyService.updateStory(params.id, user.id, input);
    return NextResponse.json(story);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Update story error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await storyService.deleteStory(params.id, user.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Delete story error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 