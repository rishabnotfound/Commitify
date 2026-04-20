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
  CheckCircle,
  XCircle,
  Loader2,
  LogOut,
  Trash2,
} from 'lucide-react';
import { Skeleton } from '@/components/Skeleton';
import { ConfirmDialog } from '@/components/ConfirmDialog';
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
  const [isRecreatingRepo, setIsRecreatingRepo] = useState(false);
  const [showRecreateDialog, setShowRecreateDialog] = useState(false);

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

      setRepoStatus({ exists: true, repo: data.repo });
      toast.success('Repository created!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create repository');
    } finally {
      setIsCreatingRepo(false);
    }
  };

  const handleRecreateRepo = async () => {
    setIsRecreatingRepo(true);

    try {
      const response = await fetch('/api/repo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: true }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to recreate repository');
      }

      setRepoStatus({ exists: true, repo: data.repo });
      setShowRecreateDialog(false);
      toast.success('Repository recreated!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to recreate repository');
    } finally {
      setIsRecreatingRepo(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-6 max-w-lg mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Settings</h1>
          <p className="text-white/40 text-xs sm:text-sm mt-0.5">Manage your account</p>
        </motion.div>

        {/* Profile Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="liquid-glass rounded-2xl p-4 sm:p-5"
        >
          <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
            <User className="w-3.5 h-3.5" />
            Profile
          </h2>

          {isLoading || !user ? (
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10">
                  <Image src={user.avatarUrl} alt={user.username} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-white">{user.username}</p>
                  {user.email && <p className="text-white/40 text-xs">{user.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] text-xs">
                  <Calendar className="w-3.5 h-3.5 text-neon-green-400" />
                  <div>
                    <p className="text-white/40">GitHub</p>
                    <p className="text-white">{formatDate(user.githubJoinDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] text-xs">
                  <Clock className="w-3.5 h-3.5 text-neon-green-400" />
                  <div>
                    <p className="text-white/40">Joined</p>
                    <p className="text-white">{formatDate(user.platformJoinDate)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.section>

        {/* Repository Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="liquid-glass rounded-2xl p-4 sm:p-5"
        >
          <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
            <GitBranch className="w-3.5 h-3.5" />
            Repository
          </h2>

          {isLoading ? (
            <Skeleton className="h-14 w-full rounded-xl" />
          ) : repoStatus?.exists && repoStatus.repo ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-neon-green-500/5 border border-neon-green-500/10">
                <CheckCircle className="w-4 h-4 text-neon-green-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{repoStatus.repo.fullName}</p>
                </div>
                <a
                  href={repoStatus.repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg glass text-white/40 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <button
                onClick={() => setShowRecreateDialog(true)}
                disabled={isRecreatingRepo}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 text-sm"
              >
                {isRecreatingRepo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>Recreate Repository</span>
              </button>

              <p className="text-white/25 text-[11px] text-center">
                This will delete all Commitify commits
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-white text-sm">Repository not found</p>
              </div>

              <button
                onClick={handleCreateRepo}
                disabled={isCreatingRepo}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neon-green-500 text-black font-medium hover:bg-neon-green-400 transition-colors disabled:opacity-50 text-sm"
              >
                {isCreatingRepo ? <Loader2 className="w-4 h-4 animate-spin" /> : <GitBranch className="w-4 h-4" />}
                <span>Create Repository</span>
              </button>
            </div>
          )}
        </motion.section>

        {/* Sign Out */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <a
            href="/api/auth/logout"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </a>
        </motion.section>
      </div>

      <ConfirmDialog
        isOpen={showRecreateDialog}
        onClose={() => setShowRecreateDialog(false)}
        onConfirm={handleRecreateRepo}
        isLoading={isRecreatingRepo}
        title="Recreate Repository?"
        description="This will permanently delete the Commitify repository and all its commits. A new empty repository will be created. This cannot be undone."
        confirmText="Recreate"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}
