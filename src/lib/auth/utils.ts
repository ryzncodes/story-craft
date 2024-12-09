import { verifyToken } from '@/lib/auth/jwt';
import { db } from '@/lib/db';

export async function getAuthUser(req: Request) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      username: true,
    },
  });

  return user;
} 