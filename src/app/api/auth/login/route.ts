import { createToken } from '@/lib/auth/jwt';
import { db } from '@/lib/db';
import { compare } from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = loginSchema.parse(body);

    const user = await db.user.findUnique({
      where: { email: input.email },
    });

    if (!user || !(await compare(input.password, user.passwordHash))) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = createToken({
      userId: user.id,
      email: user.email,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 