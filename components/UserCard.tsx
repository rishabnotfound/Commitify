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
      className="liquid-glass rounded-2xl p-6 light-beam"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-neon-green-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-neon-green-500/30 transition-colors">
            <Image
              src={user.avatarUrl}
              alt={user.username}
              fill
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* Info */}
        <div className="text-center sm:text-left flex-1">
          <div className="flex items-center gap-3 justify-center sm:justify-start mb-1">
            <h2 className="text-xl font-bold text-white">{user.username}</h2>
            <a
              href={`https://github.com/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-neon-green-400 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          {user.email && (
            <p className="text-white/40 text-sm mb-3">{user.email}</p>
          )}

          <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm">
            <div className="flex items-center gap-2 text-white/50">
              <Calendar className="w-3.5 h-3.5 text-neon-green-400" />
              <span>GitHub {formatDate(githubJoinDate)}</span>
            </div>

            <div className="flex items-center gap-2 text-white/50">
              <Clock className="w-3.5 h-3.5 text-neon-green-400" />
              <span>Joined {formatDate(platformJoinDate)}</span>
            </div>

            {user.repoName && (
              <div className="flex items-center gap-2 text-white/50">
                <GitBranch className="w-3.5 h-3.5 text-neon-green-400" />
                <span>{user.repoName}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
