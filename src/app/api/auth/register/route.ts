import { hashPassword } from '@/lib/auth/password';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3)
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, username } = registerSchema.parse(body);

    // Check if user exists
    const existingUser = await db.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email or username already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const hashedPassword = await hashPassword(password);
    const user = await db.user.create({
      data: {
        email,
        username,
        passwordHash: hashedPassword,
        profile: {
          create: {
            displayName: username
          }
        }
      },
      select: {
        id: true,
        email: true,
        username: true,
        profile: true
      }
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        profile: user.profile
      }
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 