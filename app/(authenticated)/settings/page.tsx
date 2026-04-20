'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  User,
  Calendar,
  Clock,
  GitBranch,
  ExternalLink,
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader2,
  LogOut,
} from 'lucide-react';
import { Skeleton } from '@/components/Skeleton';
import type { SafeUser } from '@/models/user';

interface RepoStatus {
  exists: boolean;
  repo: {
    name: string;
    fullName: string;
    url: string;
    defaultBranch: string;
  } | null;
}

export default function SettingsPage() {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [repoStatus, setRepoStatus] = useState<RepoStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingRepo, setIsCreatingRepo] = useState(false);

  const fetchData = async () => {
    try {
      const [userRes, repoRes] = await Promise.all([
        fetch('/api/user'),
        fetch('/api/repo'),
      ]);

      if (!userRes.ok) throw new Error('Failed to fetch user');

      const userData = await userRes.json();
      setUser(userData.user);

      if (repoRes.ok) {
        const repoData = await repoRes.json();
        setRepoStatus(repoData);
      }
    } catch (error) {
      toast.error('Failed to load settings');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRepo = async () => {
    setIsCreatingRepo(true);

    try {
      const response = await fetch('/api/repo', { method: 'POST' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create repository');
      }

      setRepoStatus({
        exists: true,
        repo: data.repo,
      });

      toast.success('Repository created successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create repository');
    } finally {
      setIsCreatingRepo(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-white/40 text-sm mt-1">Manage your account and repository</p>
      </motion.div>

      {/* Profile Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="liquid-glass rounded-2xl p-6"
      >
        <h2 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-5 flex items-center gap-2">
          <User className="w-4 h-4" />
          Profile
        </h2>

        {isLoading || !user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-14 h-14 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Avatar and Username */}
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/10">
                <Image
                  src={user.avatarUrl}
                  alt={user.username}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{user.username}</p>
                {user.email && (
                  <p className="text-white/40 text-sm">{user.email}</p>
                )}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoItem
                icon={<Calendar className="w-4 h-4 text-neon-green-400" />}
                label="GitHub Since"
                value={formatDate(user.githubJoinDate)}
              />
              <InfoItem
                icon={<Clock className="w-4 h-4 text-neon-green-400" />}
                label="Joined Commitify"
                value={formatDate(user.platformJoinDate)}
              />
            </div>
          </div>
        )}
      </motion.section>

      {/* Repository Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="liquid-glass rounded-2xl p-6"
      >
        <h2 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-5 flex items-center gap-2">
          <GitBranch className="w-4 h-4" />
          Repository
        </h2>

        {isLoading ? (
          <Skeleton className="h-16 w-full rounded-xl" />
        ) : repoStatus?.exists && repoStatus.repo ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-neon-green-500/5 border border-neon-green-500/10">
              <CheckCircle className="w-5 h-5 text-neon-green-400" />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{repoStatus.repo.fullName}</p>
                <p className="text-white/40 text-sm">
                  Branch: {repoStatus.repo.defaultBranch}
                </p>
              </div>
              <a
                href={repoStatus.repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass text-white/50 hover:text-white transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <button
              onClick={handleCreateRepo}
              disabled={isCreatingRepo}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-white/50 hover:text-white transition-colors disabled:opacity-50 text-sm"
            >
              {isCreatingRepo ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>Recreate Repository</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
              <XCircle className="w-5 h-5 text-red-400" />
              <div className="flex-1">
                <p className="text-white font-medium">Repository not found</p>
                <p className="text-white/40 text-sm">
                  Create a repository to start generating commits
                </p>
              </div>
            </div>

            <button
              onClick={handleCreateRepo}
              disabled={isCreatingRepo}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon-green-500 text-black font-medium hover:bg-neon-green-400 transition-colors disabled:opacity-50 text-sm"
            >
              {isCreatingRepo ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <GitBranch className="w-4 h-4" />
              )}
              <span>Create Repository</span>
            </button>
          </div>
        )}
      </motion.section>

      {/* Account Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="liquid-glass rounded-2xl p-6 border border-red-500/10"
      >
        <h2 className="text-sm font-medium text-red-400/70 uppercase tracking-wider mb-4">
          Account
        </h2>
        <p className="text-white/40 text-sm mb-4">
          Sign out of your Commitify session.
        </p>
        <a
          href="/api/auth/logout"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </a>
      </motion.section>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
      {icon}
      <div>
        <p className="text-xs text-white/40">{label}</p>
        <p className="text-white text-sm">{value}</p>
      </div>
    </div>
  );
}
