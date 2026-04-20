import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { encrypt } from '@/lib/encryption';
import { createSession } from '@/lib/auth';
import type { User } from '@/models/user';

interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  email: string | null;
  created_at: string;
}

interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/?error=oauth_denied', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData: GitHubTokenResponse = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error('Failed to get access token:', tokenData);
      return NextResponse.redirect(new URL('/?error=token_failed', request.url));
    }

    // Fetch user profile
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github+json',
      },
    });

    const githubUser: GitHubUser = await userResponse.json();

    // Fetch user emails if email is not public
    let email = githubUser.email;
    if (!email) {
      const emailsResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Accept': 'application/vnd.github+json',
        },
      });

      const emails: GitHubEmail[] = await emailsResponse.json();
      const primaryEmail = emails.find((e) => e.primary && e.verified);
      email = primaryEmail?.email || null;
    }

    // Encrypt the access token
    const encryptedToken = encrypt(tokenData.access_token);

    // Connect to MongoDB
    const { db } = await connectToDatabase();
    const usersCollection = db.collection<User>('users');

    // Upsert user
    const now = new Date();
    const existingUser = await usersCollection.findOne({ githubId: githubUser.id.toString() });

    const userData: Partial<User> = {
      githubId: githubUser.id.toString(),
      username: githubUser.login,
      avatarUrl: githubUser.avatar_url,
      encryptedToken,
      githubJoinDate: new Date(githubUser.created_at),
      email,
      updatedAt: now,
    };

    if (!existingUser) {
      userData.platformJoinDate = now;
      userData.createdAt = now;
      userData.repoName = null;
      userData.lastCommitDate = null;
    }

    await usersCollection.updateOne(
      { githubId: githubUser.id.toString() },
      { $set: userData },
      { upsert: true }
    );

    // Create session
    await createSession(githubUser.id.toString());

    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (err) {
    console.error('OAuth callback error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    return NextResponse.redirect(new URL(`/?error=callback_failed&details=${encodeURIComponent(errorMessage)}`, request.url));
  }
}
