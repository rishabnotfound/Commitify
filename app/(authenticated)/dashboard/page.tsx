'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { UserCard } from '@/components/UserCard';
import { StatsCards } from '@/components/StatsCards';
import { ContributionGraph, type ContributionWeek } from '@/components/ContributionGraph';
import {
  UserCardSkeleton,
  StatsSkeleton,
  ContributionGraphSkeleton,
} from '@/components/Skeleton';
import type { SafeUser } from '@/models/user';

export default function DashboardPage() {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [contributions, setContributions] = useState<ContributionWeek[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);

    try {
      const [userRes, contribRes] = await Promise.all([
        fetch('/api/user'),
        fetch('/api/contributions'),
      ]);

      if (!userRes.ok || !contribRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const userData = await userRes.json();
      const contribData = await contribRes.json();

      setUser(userData.user);
      setContributions(contribData.contributions);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-white/40 text-xs sm:text-sm mt-0.5">Your contribution overview</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchData(true)}
            disabled={isRefreshing}
            className="p-2 rounded-xl liquid-glass text-white/50 hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/graph-editor"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neon-green-500/10 border border-neon-green-500/20 text-neon-green-400 hover:bg-neon-green-500/20 transition-colors text-xs sm:text-sm font-medium group"
          >
            <span>Edit</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </motion.div>

      {/* User Card */}
      {isLoading || !user ? <UserCardSkeleton /> : <UserCard user={user} />}

      {/* Stats */}
      {isLoading || !contributions ? (
        <StatsSkeleton />
      ) : (
        <StatsCards weeks={contributions} />
      )}

      {/* Contribution Graph */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm sm:text-base font-semibold text-white">Contributions</h2>
          <span className="text-xs text-white/30">{new Date().getFullYear()}</span>
        </div>
        {isLoading || !contributions ? (
          <ContributionGraphSkeleton />
        ) : (
          <div className="liquid-glass rounded-2xl p-3 sm:p-6">
            <ContributionGraph weeks={contributions} />
          </div>
        )}
      </motion.div>
    </div>
  );
}
