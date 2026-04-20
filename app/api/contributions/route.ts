import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getContributionData } from '@/lib/github';

export async function GET() {
  const user = await getSession();

  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const contributions = await getContributionData(
      user.username,
      user.encryptedToken
    );

    return NextResponse.json({ contributions });
  } catch (error) {
    console.error('Failed to fetch contributions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contributions' },
      { status: 500 }
    );
  }
}
