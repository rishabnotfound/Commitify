import { cookies } from 'next/headers';
import { connectToDatabase } from './mongodb';
import type { User } from '@/models/user';

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session')?.value;

  if (!sessionId) {
    return null;
  }

  try {
    const { db } = await connectToDatabase();
    const user = await db.collection<User>('users').findOne({ githubId: sessionId });
    return user;
  } catch {
    return null;
  }
}

export async function createSession(githubId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('session', githubId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
