'use client';

import { motion } from 'framer-motion';
import { Github, Zap, Calendar, ArrowRight, Shield, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Footer } from '@/components/Footer';

// Mock contribution graph for preview
function ContributionPreview() {
  const weeks = 20;
  const days = 7;

  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: weeks }).map((_, weekIndex) => (
        <div key={weekIndex} className="flex flex-col gap-[3px]">
          {Array.from({ length: days }).map((_, dayIndex) => {
            const random = Math.random();
            const level = random > 0.7 ? 'bg-neon-green-500' :
                         random > 0.5 ? 'bg-neon-green-500/60' :
                         random > 0.3 ? 'bg-neon-green-500/30' :
                         'bg-white/5';
            return (
              <motion.div
                key={dayIndex}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: (weekIndex * days + dayIndex) * 0.005
                }}
                className={`w-3 h-3 rounded-sm ${level}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-neon-green-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-neon-green-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Image
              src="/banner.png"
              alt="Commitify"
              width={200}
              height={50}
              className="h-10 sm:h-12 w-auto mx-auto"
              priority
            />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white leading-tight"
          >
            Design Your GitHub
            <br />
            <span className="text-gradient">Contribution Graph</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-white/50 mb-10 max-w-xl mx-auto"
          >
            Click dates, generate commits, transform your profile.
            Take control of your contribution history.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/api/auth/github"
              className="group flex items-center gap-3 px-6 py-3.5 rounded-xl bg-neon-green-500 text-black font-semibold transition-all hover:bg-neon-green-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]"
            >
              <Github className="w-5 h-5" />
              <span>Continue with GitHub</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/terms"
              className="text-white/40 hover:text-white/70 text-sm transition-colors"
            >
              Read Terms of Service
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center gap-6 mt-8 text-white/30 text-xs"
          >
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Secure OAuth</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Instant sync</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5" />
              <span>Open source</span>
            </div>
          </motion.div>
        </div>

        {/* Graph Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 sm:mt-20"
        >
          <div className="liquid-glass rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <span className="text-xs text-white/30">contribution-graph.preview</span>
            </div>
            <ContributionPreview />
            <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-white/30">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-sm bg-white/5" />
                <div className="w-2.5 h-2.5 rounded-sm bg-neon-green-500/30" />
                <div className="w-2.5 h-2.5 rounded-sm bg-neon-green-500/60" />
                <div className="w-2.5 h-2.5 rounded-sm bg-neon-green-500" />
              </div>
              <span>More</span>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto w-full"
        >
          <FeatureCard
            icon={<Calendar className="w-5 h-5 text-neon-green-400" />}
            title="Visual Editor"
            description="Click dates to add commits"
          />
          <FeatureCard
            icon={<Zap className="w-5 h-5 text-neon-green-400" />}
            title="Backdated Commits"
            description="Generate commits for any date"
          />
          <FeatureCard
            icon={<Github className="w-5 h-5 text-neon-green-400" />}
            title="Real-time Sync"
            description="Changes reflect instantly"
          />
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="liquid-glass rounded-xl p-4 text-center">
      <div className="inline-flex items-center justify-center mb-3 p-2.5 rounded-lg bg-neon-green-500/10">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
      <p className="text-white/40 text-xs">{description}</p>
    </div>
  );
}
