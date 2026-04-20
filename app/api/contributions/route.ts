import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getContributionData } from '@/lib/github';

export async function GET(request: NextRequest) {
  const user = await getSession();

  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    // Get year from query params
    const searchParams = request.nextUrl.searchParams;
    const yearParam = searchParams.get('year');
    const year = yearParam ? parseInt(yearParam, 10) : undefined;

    const contributions = await getContributionData(
      user.username,
      user.encryptedToken,
      year
    );

    return NextResponse.json({ contributions, year: year || new Date().getFullYear() });
  } catch (error) {
    console.error('Failed to fetch contributions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contributions' },
      { status: 500 }
    );
  }
}
