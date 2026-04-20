import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { checkRepoExists, ensureRepository, recreateRepository } from '@/lib/github';
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

// Create repository (if doesn't exist)
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

// Recreate repository (delete existing + create new)
export async function PUT(request: NextRequest) {
  const user = await getSession();

  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    // Check for confirmation in request body
    const body = await request.json().catch(() => ({}));
    if (!body.confirm) {
      return NextResponse.json(
        { error: 'Confirmation required' },
        { status: 400 }
      );
    }

    const repo = await recreateRepository(user.username, user.encryptedToken);

    // Update user's repo name and reset last commit date
    const { db } = await connectToDatabase();
    await db.collection<User>('users').updateOne(
      { githubId: user.githubId },
      {
        $set: {
          repoName: repo.name,
          lastCommitDate: null,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Repository recreated successfully',
      repo: {
        name: repo.name,
        fullName: repo.full_name,
        url: repo.html_url,
        defaultBranch: repo.default_branch,
      },
    });
  } catch (error) {
    console.error('Failed to recreate repo:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to recreate repository' },
      { status: 500 }
    );
  }
}
