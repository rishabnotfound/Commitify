import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { checkRepoExists, ensureRepository } from '@/lib/github';
import type { User } from '@/models/user';

export async function GET() {
  const user = await getSession();

  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const repoName = `Commitify-${user.username}`;
    const repo = await checkRepoExists(user.username, repoName, user.encryptedToken);

    return NextResponse.json({
      exists: !!repo,
      repo: repo
        ? {
            name: repo.name,
            fullName: repo.full_name,
            url: repo.html_url,
            defaultBranch: repo.default_branch,
          }
        : null,
    });
  } catch (error) {
    console.error('Failed to check repo:', error);
    return NextResponse.json(
      { error: 'Failed to check repository status' },
      { status: 500 }
    );
  }
}

export async function POST() {
  const user = await getSession();

  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const repo = await ensureRepository(user.username, user.encryptedToken);

    // Update user's repo name
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

    return NextResponse.json({
      success: true,
      repo: {
        name: repo.name,
        fullName: repo.full_name,
        url: repo.html_url,
        defaultBranch: repo.default_branch,
      },
    });
  } catch (error) {
    console.error('Failed to create/ensure repo:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create repository' },
      { status: 500 }
    );
  }
}
