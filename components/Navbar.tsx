'use client';

import { motion } from 'framer-motion';
import { LayoutDashboard, Grid3X3, Settings, LogOut } from 'lucide-react';
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
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
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
      transition={{ duration: 0.5 }}
      className="fixed top-2 left-3 right-3 sm:left-1/2 sm:right-auto sm:top-4 sm:-translate-x-1/2 sm:w-auto z-50"
    >
      <div className="liquid-glass rounded-2xl px-2 py-1.5 flex items-center justify-between sm:justify-start gap-1">
        <Link
          href="/dashboard"
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-all"
        >
          <Image
            src="/banner.png"
            alt="Commitify"
            width={500}
            height={500}
            className="w-20 h-7"
          />
        </Link>

        {/* Divider - hidden on mobile */}
        <div className="hidden sm:block w-px h-6 bg-white/10 mx-1" />

        {/* Nav Items */}
        <div className="flex items-center gap-0.5 flex-1 sm:flex-none justify-around sm:justify-start">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all text-xs sm:text-sm',
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
                <span className="relative z-10 hidden xs:inline sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-2 py-2 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm"
        >
          <LogOut className="w-4 h-4" />
        </button>

        {/* Avatar */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl overflow-hidden border border-white/10">
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
