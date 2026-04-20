'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Calendar, GitBranch, Clock, ExternalLink } from 'lucide-react';
import type { SafeUser } from '@/models/user';

interface UserCardProps {
  user: SafeUser;
}

export function UserCard({ user }: UserCardProps) {
  const githubJoinDate = new Date(user.githubJoinDate);
  const platformJoinDate = new Date(user.platformJoinDate);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="liquid-glass rounded-2xl p-4 sm:p-6"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-white/10">
            <Image
              src={user.avatarUrl}
              alt={user.username}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg sm:text-xl font-bold text-white truncate">{user.username}</h2>
            <a
              href={`https://github.com/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-neon-green-400 transition-colors flex-shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm text-white/50">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-neon-green-400" />
              {formatDate(githubJoinDate)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-neon-green-400" />
              Joined {formatDate(platformJoinDate)}
            </span>
            {user.repoName && (
              <span className="flex items-center gap-1">
                <GitBranch className="w-3 h-3 text-neon-green-400" />
                {user.repoName}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
