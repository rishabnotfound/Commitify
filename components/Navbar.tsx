'use client';

import { motion } from 'framer-motion';
import { GitBranch, LayoutDashboard, Grid3X3, Settings, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';

interface NavbarProps {
  user: {
    username: string;
    avatarUrl: string;
  };
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/graph-editor', label: 'Editor', icon: Grid3X3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
    >
      <div className="liquid-glass rounded-2xl px-2 py-2 flex items-center gap-1 light-beam">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-all duration-300 group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-neon-green-500/30 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <GitBranch className="w-5 h-5 text-neon-green-400 relative" />
          </div>
          <span className="font-semibold text-white/90 hidden sm:inline text-sm">Commitify</span>
        </Link>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Nav Items */}
        <div className="flex items-center gap-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 text-sm',
                  isActive
                    ? 'text-neon-green-400'
                    : 'text-white/50 hover:text-white/90 hover:bg-white/5'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-neon-green-500/10 rounded-xl border border-neon-green-500/20"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <Icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10 hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 text-sm"
        >
          <LogOut className="w-4 h-4" />
        </button>

        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="ml-1"
        >
          <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-white/10 hover:border-neon-green-500/40 transition-all duration-300 group">
            <div className="absolute inset-0 bg-neon-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Image
              src={user.avatarUrl}
              alt={user.username}
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
