'use client';

import { motion } from 'framer-motion';
import { GitBranch, Github, Heart } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative mt-auto border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <GitBranch className="w-4 h-4 text-neon-green-400" />
              <span className="font-medium text-white/70 text-sm">Commitify</span>
            </Link>
            <a
              href="https://github.com/rishabnotfound/Commitify"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-white/60 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>

          {/* Copyright & Made with */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs text-white/30">
            <span>© {new Date().getFullYear()} Commitify</span>
            <span className="hidden sm:inline text-white/10">•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" />
            </span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
