'use client';

import { motion } from 'framer-motion';
import { GitBranch, Github, Heart } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative mt-auto border-t border-white/5"
    >
      {/* Subtle glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-neon-green-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-neon-green-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <GitBranch className="w-6 h-6 text-neon-green-400 relative" />
              </div>
              <span className="font-semibold text-white text-lg">Commitify</span>
            </Link>
            <p className="text-white/40 text-sm max-w-xs leading-relaxed">
              Shape your GitHub contribution graph with precision.
              Design patterns, fill gaps, and make your profile stand out.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white/70 font-medium text-sm mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-white/40 hover:text-neon-green-400 text-sm transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/graph-editor" className="text-white/40 hover:text-neon-green-400 text-sm transition-colors">
                  Graph Editor
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-white/40 hover:text-neon-green-400 text-sm transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white/70 font-medium text-sm mb-4">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/rishabnotfound/Commitify"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/40 hover:text-neon-green-400 text-sm transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Commitify. Open source project.
          </p>
          <p className="flex items-center gap-1.5 text-white/30 text-xs">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> using Next.js & GitHub API
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
