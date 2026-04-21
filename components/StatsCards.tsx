'use client';

import { motion } from 'framer-motion';
import { GitCommit, Calendar, Flame, TrendingUp } from 'lucide-react';
import type { ContributionWeek } from './ContributionGraph';

interface StatsCardsProps {
  weeks: ContributionWeek[];
}

export function StatsCards({ weeks }: StatsCardsProps) {
  const allDays = weeks.flatMap((week) => week.contributionDays);
  const totalContributions = allDays.reduce((sum, day) => sum + day.contributionCount, 0);
  const activeDays = allDays.filter((day) => day.contributionCount > 0).length;

  const today = new Date().toISOString().split('T')[0];
  const sortedDays = [...allDays].sort((a, b) => b.date.localeCompare(a.date));
  let currentStreak = 0;
  let foundToday = false;

  for (const day of sortedDays) {
    if (day.date > today) continue;
    if (!foundToday && day.date !== today && day.contributionCount === 0) {
      break;
    }
    foundToday = true;
    if (day.contributionCount > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  let longestStreak = 0;
  let tempStreak = 0;
  for (const day of allDays) {
    if (day.contributionCount > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  const stats = [
    {
      icon: GitCommit,
      label: 'Total',
      value: totalContributions.toLocaleString(),
      color: 'text-neon-green-400',
      bg: 'bg-neon-green-500/10',
    },
    {
      icon: Calendar,
      label: 'Active',
      value: activeDays.toString(),
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      icon: Flame,
      label: 'Streak',
      value: `${currentStreak}`,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
    },
    {
      icon: TrendingUp,
      label: 'Best',
      value: `${longestStreak}`,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-3">
      <h3 className="text-sm text-white/40 font-medium">{currentYear} Statistics</h3>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="liquid-glass rounded-xl p-2.5 sm:p-4"
          >
            <div className="flex items-center gap-1.5 mb-1 sm:mb-2">
              <div className={`p-1 sm:p-1.5 rounded-lg ${stat.bg}`}>
                <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${stat.color}`} />
              </div>
              <span className="text-[10px] sm:text-xs text-white/40 hidden sm:inline">{stat.label}</span>
            </div>
            <p className="text-base sm:text-xl font-bold text-white">{stat.value}</p>
            <p className="text-[10px] text-white/30 sm:hidden">{stat.label}</p>
          </motion.div>
        );
      })}
      </div>
    </div>
  );
}
