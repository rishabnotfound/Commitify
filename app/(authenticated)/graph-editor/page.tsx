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
  const [isLoading, setIsLoading] = useState(true);

  const fetchContributions = useCallback(async () => {
    try {
      const response = await fetch('/api/contributions');
      if (!response.ok) throw new Error('Failed to fetch contributions');
      const data = await response.json();
      setContributions(data.contributions);
    } catch (error) {
      toast.error('Failed to load contributions');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContributions();
  }, [fetchContributions]);

  const handleCommitsGenerated = () => {
    setTimeout(() => {
      fetchContributions();
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">Graph Editor</h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neon-green-500/10 border border-neon-green-500/20">
              <Wand2 className="w-3 h-3 text-neon-green-400" />
              <span className="text-xs text-neon-green-400 font-medium">Interactive</span>
            </div>
          </div>
          <p className="text-white/40 text-sm mt-1">Click dates to add commits • Navigate years freely</p>
        </div>

        <button
          onClick={fetchContributions}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 rounded-xl liquid-glass text-white/50 hover:text-white transition-colors disabled:opacity-50 text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </motion.div>

      {/* Editor */}
      {isLoading || !contributions ? (
        <ContributionGraphSkeleton />
      ) : (
        <GraphEditor
          weeks={contributions}
          onCommitsGenerated={handleCommitsGenerated}
        />
      )}
    </div>
  );
}
