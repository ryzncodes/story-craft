import { createToken } from '@/lib/auth/jwt';
import { db } from '@/lib/db';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { email: input.email },
          { username: input.username },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email or username already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(input.password, 12);

    // Create user
    const user = await db.user.create({
      data: {
        email: input.email,
        username: input.username,
        passwordHash: hashedPassword,
      },
    });

    // Create token
    const token = createToken({
      userId: user.id,
      email: user.email,
    });

    // Return user data and token
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token,
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