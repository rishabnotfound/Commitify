'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { GraphEditor } from '@/components/GraphEditor';
import { ContributionGraphSkeleton } from '@/components/Skeleton';
import type { ContributionWeek } from '@/components/ContributionGraph';

export default function GraphEditorPage() {
  const [contributions, setContributions] = useState<ContributionWeek[] | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [contribRes, userRes] = await Promise.all([
        fetch('/api/contributions'),
        fetch('/api/user')
      ]);

      if (!contribRes.ok) throw new Error('Failed to fetch contributions');

      const contribData = await contribRes.json();
      setContributions(contribData.contributions);

      if (userRes.ok) {
        const userData = await userRes.json();
        setTermsAccepted(userData.user?.termsAccepted || false);
      }
    } catch (error) {
      toast.error('Failed to load data');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchContributions = useCallback(async () => {
    try {
      const response = await fetch('/api/contributions');
      if (!response.ok) throw new Error('Failed to fetch contributions');
      const data = await response.json();
      setContributions(data.contributions);
    } catch (error) {
      toast.error('Failed to load contributions');
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCommitsGenerated = () => {
    setTimeout(() => fetchContributions(), 3000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Graph Editor</h1>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-neon-green-500/10 border border-neon-green-500/20">
              <Wand2 className="w-2.5 h-2.5 text-neon-green-400" />
              <span className="text-[10px] text-neon-green-400 font-medium">Interactive</span>
            </div>
          </div>
          <p className="text-white/40 text-xs sm:text-sm mt-0.5">Tap dates to add commits</p>
        </div>

        <button
          onClick={fetchContributions}
          disabled={isLoading}
          className="p-2 rounded-xl liquid-glass text-white/50 hover:text-white transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </motion.div>

      {/* Editor */}
      {isLoading || !contributions ? (
        <ContributionGraphSkeleton />
      ) : (
        <GraphEditor
          initialWeeks={contributions}
          termsAccepted={termsAccepted}
          onCommitsGenerated={handleCommitsGenerated}
        />
      )}
    </div>
  );
}
