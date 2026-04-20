import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  githubId: string;
  username: string;
  avatarUrl: string;
  encryptedToken: string;
  githubJoinDate: Date;
  platformJoinDate: Date;
  email: string | null;
  repoName: string | null;
  lastCommitDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SafeUser {
  _id: string;
  githubId: string;
  username: string;
  avatarUrl: string;
  githubJoinDate: string;
  platformJoinDate: string;
  email: string | null;
  repoName: string | null;
  lastCommitDate: string | null;
}

export function toSafeUser(user: User): SafeUser {
  return {
    _id: user._id?.toString() || '',
    githubId: user.githubId,
    username: user.username,
    avatarUrl: user.avatarUrl,
    githubJoinDate: user.githubJoinDate.toISOString(),
    platformJoinDate: user.platformJoinDate.toISOString(),
    email: user.email,
    repoName: user.repoName,
    lastCommitDate: user.lastCommitDate?.toISOString() || null,
  };
}
