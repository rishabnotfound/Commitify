import { decrypt } from './encryption';

const GITHUB_API_BASE = 'https://api.github.com';

export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  email: string | null;
  created_at: string;
}

export interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE';
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  default_branch: string;
  html_url: string;
}

async function makeGitHubRequest(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<Response> {
  const decryptedToken = decrypt(token);

  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${decryptedToken}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  return response;
}

export async function getGitHubUser(token: string): Promise<GitHubUser> {
  const response = await makeGitHubRequest('/user', token);

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub user: ${response.statusText}`);
  }

  return response.json();
}

export async function getGitHubUserEmails(token: string): Promise<{ email: string; primary: boolean }[]> {
  const response = await makeGitHubRequest('/user/emails', token);

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub emails: ${response.statusText}`);
  }

  return response.json();
}

export async function getContributionData(
  username: string,
  token: string,
  year?: number
): Promise<ContributionWeek[]> {
  const decryptedToken = decrypt(token);

  // Build date range for the year
  const targetYear = year || new Date().getFullYear();
  const from = `${targetYear}-01-01T00:00:00Z`;
  const to = `${targetYear}-12-31T23:59:59Z`;

  // Use GraphQL API for contribution data with date range
  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${decryptedToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { username, from, to },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch contributions: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  return data.data.user.contributionsCollection.contributionCalendar.weeks;
}

export async function checkRepoExists(
  username: string,
  repoName: string,
  token: string
): Promise<Repository | null> {
  const response = await makeGitHubRequest(`/repos/${username}/${repoName}`, token);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to check repo: ${response.statusText}`);
  }

  return response.json();
}

export async function createRepository(
  repoName: string,
  token: string
): Promise<Repository> {
  const response = await makeGitHubRequest('/user/repos', token, {
    method: 'POST',
    body: JSON.stringify({
      name: repoName,
      description: 'Repository for Commitify contribution graph',
      private: false,
      auto_init: true,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create repo: ${error.message || response.statusText}`);
  }

  return response.json();
}

export async function getRepoContents(
  username: string,
  repoName: string,
  path: string,
  token: string
): Promise<{ sha: string; content: string } | null> {
  const response = await makeGitHubRequest(
    `/repos/${username}/${repoName}/contents/${path}`,
    token
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to get file contents: ${response.statusText}`);
  }

  return response.json();
}

export async function getLatestCommit(
  username: string,
  repoName: string,
  branch: string,
  token: string
): Promise<{ sha: string } | null> {
  const response = await makeGitHubRequest(
    `/repos/${username}/${repoName}/git/ref/heads/${branch}`,
    token
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to get latest commit: ${response.statusText}`);
  }

  const data = await response.json();
  return { sha: data.object.sha };
}

export async function createCommit(
  username: string,
  repoName: string,
  message: string,
  date: string,
  parentSha: string,
  treeSha: string,
  token: string
): Promise<{ sha: string }> {
  const decryptedToken = decrypt(token);

  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${username}/${repoName}/git/commits`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${decryptedToken}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        tree: treeSha,
        parents: [parentSha],
        author: {
          name: username,
          email: `${username}@users.noreply.github.com`,
          date: date,
        },
        committer: {
          name: username,
          email: `${username}@users.noreply.github.com`,
          date: date,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create commit: ${error.message || response.statusText}`);
  }

  return response.json();
}

export async function updateRef(
  username: string,
  repoName: string,
  branch: string,
  commitSha: string,
  token: string
): Promise<void> {
  const response = await makeGitHubRequest(
    `/repos/${username}/${repoName}/git/refs/heads/${branch}`,
    token,
    {
      method: 'PATCH',
      body: JSON.stringify({
        sha: commitSha,
        force: true,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to update ref: ${error.message || response.statusText}`);
  }
}

export async function getCommitTree(
  username: string,
  repoName: string,
  commitSha: string,
  token: string
): Promise<string> {
  const response = await makeGitHubRequest(
    `/repos/${username}/${repoName}/git/commits/${commitSha}`,
    token
  );

  if (!response.ok) {
    throw new Error(`Failed to get commit: ${response.statusText}`);
  }

  const data = await response.json();
  return data.tree.sha;
}

export async function generateCommitsForDate(
  username: string,
  repoName: string,
  date: string,
  count: number,
  token: string,
  customMessage?: string | null
): Promise<void> {
  // Get the latest commit to use as parent
  const repo = await checkRepoExists(username, repoName, token);
  if (!repo) {
    throw new Error('Repository does not exist');
  }

  const latestCommit = await getLatestCommit(username, repoName, repo.default_branch, token);
  if (!latestCommit) {
    throw new Error('Could not get latest commit');
  }

  let parentSha = latestCommit.sha;
  const treeSha = await getCommitTree(username, repoName, parentSha, token);

  // Create commits with timestamps spread across the day
  for (let i = 0; i < count; i++) {
    const hour = Math.floor((i / count) * 12) + 8; // Spread from 8 AM to 8 PM
    const minute = Math.floor(Math.random() * 60);
    const commitDate = `${date}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00Z`;

    // Build commit message with placeholder replacement
    let message = customMessage || 'Commitify: {username} Contribution {date}';
    message = message
      .replace(/\{username\}/gi, username)
      .replace(/\{date\}/gi, date);

    // If message has no placeholders and count > 1, add index
    if (count > 1 && !customMessage) {
      message = `Commitify: ${username} Contribution ${date} #${i + 1}`;
    } else if (count > 1) {
      message = `${message} #${i + 1}`;
    }

    const commit = await createCommit(
      username,
      repoName,
      message,
      commitDate,
      parentSha,
      treeSha,
      token
    );

    parentSha = commit.sha;
  }

  // Update the branch ref to point to the latest commit
  await updateRef(username, repoName, repo.default_branch, parentSha, token);
}

export async function deleteRepository(
  username: string,
  repoName: string,
  token: string
): Promise<void> {
  const response = await makeGitHubRequest(
    `/repos/${username}/${repoName}`,
    token,
    { method: 'DELETE' }
  );

  if (!response.ok && response.status !== 404) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Failed to delete repo: ${error.message || response.statusText}`);
  }
}

export async function ensureRepository(
  username: string,
  token: string
): Promise<Repository> {
  const repoName = `Commitify-${username}`;

  let repo = await checkRepoExists(username, repoName, token);

  if (!repo) {
    repo = await createRepository(repoName, token);
    // Wait for GitHub to initialize the repo
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  return repo;
}

export async function recreateRepository(
  username: string,
  token: string
): Promise<Repository> {
  const repoName = `Commitify-${username}`;

  // Delete existing repo if it exists
  await deleteRepository(username, repoName, token);

  // Wait a bit for GitHub to process the deletion
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Create new repo
  const repo = await createRepository(repoName, token);

  // Wait for GitHub to initialize the repo
  await new Promise(resolve => setTimeout(resolve, 2000));

  return repo;
}
