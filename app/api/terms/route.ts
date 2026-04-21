import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import type { User } from '@/models/user';

export async function POST() {
  const user = await getSession();

  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const { db } = await connectToDatabase();

    await db.collection<User>('users').updateOne(
      { githubId: user.githubId },
      {
        $set: {
          termsAccepted: true,
          termsAcceptedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to accept terms:', error);
    return NextResponse.json(
      { error: 'Failed to save preference' },
      { status: 500 }
    );
  }
}
