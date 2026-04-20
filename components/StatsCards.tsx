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

  // Calculate current streak
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

  // Calculate longest streak
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
      label: 'Contributions',
      value: totalContributions.toLocaleString(),
      color: 'text-neon-green-400',
      bg: 'bg-neon-green-500/10',
    },
    {
      icon: Calendar,
      label: 'Active Days',
      value: activeDays.toString(),
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${currentStreak}d`,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
    },
    {
      icon: TrendingUp,
      label: 'Best Streak',
      value: `${longestStreak}d`,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="liquid-glass rounded-xl p-4 group"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${stat.bg} group-hover:scale-110 transition-transform`}>
                <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
              </div>
              <span className="text-xs text-white/40">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
