'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Save, Trash2, Loader2, Calendar, Plus, Minus,
  ChevronLeft, ChevronRight, Sparkles, Clock
} from 'lucide-react';
import { ContributionGraph, generateEmptyYearData, type ContributionWeek, type ContributionDay } from './ContributionGraph';
import { cn } from '@/utils/cn';

interface GraphEditorProps {
  weeks: ContributionWeek[];
  onCommitsGenerated?: () => void;
}

export function GraphEditor({ weeks, onCommitsGenerated }: GraphEditorProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedDates, setSelectedDates] = useState<Map<string, number>>(new Map());
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commitCount, setCommitCount] = useState(1);

  // Generate graph data for selected year
  const displayWeeks = useMemo(() => {
    if (selectedYear === currentYear) {
      return weeks;
    }
    return generateEmptyYearData(selectedYear);
  }, [selectedYear, currentYear, weeks]);

  const handleDateClick = useCallback((date: string, _currentCount: number) => {
    setSelectedDates((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(date)) {
        const current = newMap.get(date)!;
        if (current === commitCount) {
          newMap.delete(date);
        } else {
          newMap.set(date, commitCount);
        }
      } else {
        newMap.set(date, commitCount);
      }
      return newMap;
    });
  }, [commitCount]);

  const handleDateHover = useCallback((_date: string | null, day: ContributionDay | null) => {
    setHoveredDay(day);
  }, []);

  const clearSelection = () => {
    setSelectedDates(new Map());
  };

  const handleSubmit = async () => {
    if (selectedDates.size === 0) {
      toast.error('Please select at least one date');
      return;
    }

    setIsSubmitting(true);

    try {
      const commits = Array.from(selectedDates.entries()).map(([date, count]) => ({
        date,
        count,
      }));

      const response = await fetch('/api/commits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commits }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate commits');
      }

      toast.success(data.message, {
        description: 'Changes will reflect on GitHub shortly',
      });
      setSelectedDates(new Map());
      onCommitsGenerated?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate commits');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalCommits = Array.from(selectedDates.values()).reduce((sum, count) => sum + count, 0);
  const selectedInCurrentView = Array.from(selectedDates.entries()).filter(
    ([date]) => date.startsWith(selectedYear.toString())
  ).length;

  // Year navigation
  const minYear = 2008; // GitHub was founded in 2008
  const canGoBack = selectedYear > minYear;
  const canGoForward = selectedYear < currentYear;

  return (
    <div className="space-y-6">
      {/* Year Selector */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-4"
      >
        <button
          onClick={() => canGoBack && setSelectedYear(selectedYear - 1)}
          disabled={!canGoBack}
          className={cn(
            'p-2 rounded-xl transition-all duration-300',
            canGoBack
              ? 'liquid-glass hover:bg-white/10 text-white/70 hover:text-white'
              : 'text-white/20 cursor-not-allowed'
          )}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="liquid-glass rounded-2xl px-6 py-3 flex items-center gap-3 min-w-[180px] justify-center">
          <Calendar className="w-4 h-4 text-neon-green-400" />
          <span className="text-xl font-semibold text-white">{selectedYear}</span>
          {selectedYear === currentYear && (
            <span className="text-xs text-neon-green-400 bg-neon-green-500/10 px-2 py-0.5 rounded-full">
              Current
            </span>
          )}
          {selectedYear < currentYear && (
            <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
              Past
            </span>
          )}
        </div>

        <button
          onClick={() => canGoForward && setSelectedYear(selectedYear + 1)}
          disabled={!canGoForward}
          className={cn(
            'p-2 rounded-xl transition-all duration-300',
            canGoForward
              ? 'liquid-glass hover:bg-white/10 text-white/70 hover:text-white'
              : 'text-white/20 cursor-not-allowed'
          )}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </motion.div>

      {/* Quick year jumps */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {[2008, 2010, 2015, 2020, currentYear - 1, currentYear].filter((y, i, arr) => arr.indexOf(y) === i).map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300',
              selectedYear === year
                ? 'bg-neon-green-500/20 text-neon-green-400 border border-neon-green-500/30'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            )}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Commit count control */}
          <div className="liquid-glass rounded-xl px-4 py-2 flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-neon-green-400" />
            <span className="text-sm text-white/50">Commits:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCommitCount(Math.max(1, commitCount - 1))}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-neon-green-400 font-mono text-lg w-6 text-center font-semibold">
                {commitCount}
              </span>
              <button
                onClick={() => setCommitCount(Math.min(20, commitCount + 1))}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Quick commit presets */}
          <div className="hidden sm:flex items-center gap-1">
            {[1, 5, 10, 15].map((count) => (
              <button
                key={count}
                onClick={() => setCommitCount(count)}
                className={cn(
                  'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-300',
                  commitCount === count
                    ? 'bg-neon-green-500/20 text-neon-green-400'
                    : 'text-white/30 hover:text-white/60 hover:bg-white/5'
                )}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {selectedDates.size > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={clearSelection}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear</span>
              </motion.button>
            )}
          </AnimatePresence>

          <button
            onClick={handleSubmit}
            disabled={selectedDates.size === 0 || isSubmitting}
            className={cn(
              'flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all duration-300 text-sm',
              selectedDates.size > 0
                ? 'bg-neon-green-500 text-black hover:bg-neon-green-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]'
                : 'bg-white/5 text-white/30 cursor-not-allowed'
            )}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Generate</span>
          </button>
        </div>
      </div>

      {/* Selection info */}
      <AnimatePresence>
        {selectedDates.size > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="liquid-glass rounded-2xl p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neon-green-400" />
                  <span className="text-white/70 text-sm">
                    <span className="text-neon-green-400 font-semibold">{selectedDates.size}</span> date{selectedDates.size !== 1 ? 's' : ''}
                  </span>
                </div>
                {selectedInCurrentView !== selectedDates.size && (
                  <span className="text-white/40 text-xs">
                    ({selectedInCurrentView} in {selectedYear})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <Clock className="w-4 h-4 text-neon-green-400" />
                <span>Total: <span className="text-neon-green-400 font-semibold">{totalCommits}</span> commits</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Graph */}
      <motion.div
        key={selectedYear}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="liquid-glass rounded-2xl p-6"
      >
        <ContributionGraph
          weeks={displayWeeks}
          interactive
          selectedDates={selectedDates}
          onDateClick={handleDateClick}
          onDateHover={handleDateHover}
          year={selectedYear}
        />
      </motion.div>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hoveredDay && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 liquid-glass rounded-xl px-4 py-2 text-sm z-50"
          >
            <span className="text-white/50">{hoveredDay.date}</span>
            <span className="mx-2 text-white/20">•</span>
            <span className="text-neon-green-400 font-medium">
              {hoveredDay.contributionCount} contribution{hoveredDay.contributionCount !== 1 ? 's' : ''}
            </span>
            {selectedDates.has(hoveredDay.date) && (
              <>
                <span className="mx-2 text-white/20">•</span>
                <span className="text-white/50">
                  +{selectedDates.get(hoveredDay.date)} pending
                </span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <p className="text-center text-white/30 text-xs">
        Click dates to select • Use year navigation to commit to any year • Past dates work too
      </p>
    </div>
  );
}
