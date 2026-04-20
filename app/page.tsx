'use client';

import { motion } from 'framer-motion';
import { Github, Zap, Calendar, GitBranch, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Floating orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-green-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-green-500/5 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm"
          >
            <Sparkles className="w-4 h-4 text-neon-green-400" />
            <span className="text-white/70">Shape your GitHub presence</span>
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 inline-flex items-center justify-center"
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 bg-neon-green-500 blur-3xl rounded-full"
              />
              <div className="relative liquid-glass rounded-3xl p-6 light-beam">
                <GitBranch className="w-14 h-14 text-neon-green-400" />
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="text-gradient">Commitify</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Design your GitHub contribution graph with surgical precision.
            Click dates, generate commits, and transform your profile instantly.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/api/auth/github"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-neon-green-500 text-black text-lg font-semibold overflow-hidden transition-all duration-300 hover:bg-neon-green-400 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Github className="w-5 h-5" />
                <span>Continue with GitHub</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>

          {/* Trust text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 text-white/30 text-sm"
          >
            Secure OAuth • No password stored • Open source
          </motion.p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto px-6 w-full"
        >
          <FeatureCard
            icon={<Calendar className="w-6 h-6 text-neon-green-400" />}
            title="Visual Editor"
            description="Click any date to add commits. Navigate through years with ease."
            delay={0}
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6 text-neon-green-400" />}
            title="Instant Generation"
            description="Commits are created with proper timestamps automatically."
            delay={0.1}
          />
          <FeatureCard
            icon={<Github className="w-6 h-6 text-neon-green-400" />}
            title="Real-time Sync"
            description="Changes reflect on your GitHub profile within minutes."
            delay={0.2}
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
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 + delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="liquid-glass liquid-glass-hover rounded-2xl p-6 text-center group"
    >
      <div className="inline-flex items-center justify-center mb-4 p-3 rounded-xl bg-neon-green-500/10 group-hover:bg-neon-green-500/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <p className="text-white/40 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}
