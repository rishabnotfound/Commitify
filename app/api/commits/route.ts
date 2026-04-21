import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ensureRepository, generateCommitsForDate } from '@/lib/github';
import type { User } from '@/models/user';

interface CommitRequest {
  date: string;
  count: number;
}

interface CommitsPayload {
  commits: CommitRequest[];
  customMessage?: string | null;
}

export async function POST(request: NextRequest) {
  const user = await getSession();

  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const body: CommitsPayload = await request.json();
    const { commits, customMessage } = body;

    if (!commits || !Array.isArray(commits) || commits.length === 0) {
      return NextResponse.json(
        { error: 'Invalid commits data' },
        { status: 400 }
      );
    }

    // Ensure repository exists
    const repo = await ensureRepository(user.username, user.encryptedToken);

    // Update user's repo name if not set
    if (!user.repoName || user.repoName !== repo.name) {
      const { db } = await connectToDatabase();
      await db.collection<User>('users').updateOne(
        { githubId: user.githubId },
        {
          $set: {
            repoName: repo.name,
            updatedAt: new Date(),
          },
        }
      );
    }

    // Generate commits for each date
    const results: { date: string; success: boolean; error?: string }[] = [];

    for (const commit of commits) {
      try {
        await generateCommitsForDate(
          user.username,
          repo.name,
          commit.date,
          commit.count,
          user.encryptedToken,
          customMessage
        );
        results.push({ date: commit.date, success: true });
      } catch (error) {
        results.push({
          date: commit.date,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Update last commit date
    const { db } = await connectToDatabase();
    await db.collection<User>('users').updateOne(
      { githubId: user.githubId },
      {
        $set: {
          lastCommitDate: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `Generated commits for ${successCount} dates. ${failCount > 0 ? `Failed for ${failCount} dates.` : ''}`,
      results,
      repoUrl: repo.html_url,
    });
  } catch (error) {
    console.error('Failed to generate commits:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate commits' },
      { status: 500 }
    );
  }
}
