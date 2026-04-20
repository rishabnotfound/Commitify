'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Save, Trash2, Loader2, Calendar, Plus, Minus,
  ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react';
import { ContributionGraph, generateEmptyYearData, type ContributionWeek, type ContributionDay } from './ContributionGraph';
import { cn } from '@/utils/cn';

interface GraphEditorProps {
  initialWeeks: ContributionWeek[];
  onCommitsGenerated?: () => void;
}

interface TooltipPosition {
  x: number;
  y: number;
}

export function GraphEditor({ initialWeeks, onCommitsGenerated }: GraphEditorProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [displayWeeks, setDisplayWeeks] = useState<ContributionWeek[]>(initialWeeks);
  const [isLoadingYear, setIsLoadingYear] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Map<string, number>>(new Map());
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
  const [tooltipPos, setTooltipPos] = useState<TooltipPosition | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commitCount, setCommitCount] = useState(1);
  const graphRef = useRef<HTMLDivElement>(null);

  // Fetch contributions for selected year
  const fetchYearContributions = useCallback(async (year: number) => {
    if (year === currentYear) {
      setDisplayWeeks(initialWeeks);
      return;
    }

    setIsLoadingYear(true);
    try {
      const response = await fetch(`/api/contributions?year=${year}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setDisplayWeeks(data.contributions);
    } catch (error) {
      console.error('Failed to fetch year contributions:', error);
      setDisplayWeeks(generateEmptyYearData(year));
    } finally {
      setIsLoadingYear(false);
    }
  }, [currentYear, initialWeeks]);

  useEffect(() => {
    fetchYearContributions(selectedYear);
  }, [selectedYear, fetchYearContributions]);

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

  const handleDateHover = useCallback((date: string | null, day: ContributionDay | null, event?: React.MouseEvent) => {
    setHoveredDay(day);
    if (day && event) {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      setTooltipPos({
        x: rect.left + rect.width / 2,
        y: rect.top - 8,
      });
    } else {
      setTooltipPos(null);
    }
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commits }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate commits');
      }

      toast.success(data.message);
      setSelectedDates(new Map());
      onCommitsGenerated?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate commits');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalCommits = Array.from(selectedDates.values()).reduce((sum, count) => sum + count, 0);

  const minYear = 2000;
  const canGoBack = selectedYear > minYear;
  const canGoForward = selectedYear < currentYear;

  return (
    <div className="space-y-4">
      {/* Year Selector */}
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        <button
          onClick={() => canGoBack && setSelectedYear(selectedYear - 1)}
          disabled={!canGoBack || isLoadingYear}
          className={cn(
            'p-2 rounded-xl transition-all',
            canGoBack && !isLoadingYear
              ? 'liquid-glass hover:bg-white/10 text-white/70 hover:text-white'
              : 'text-white/20 cursor-not-allowed'
          )}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="liquid-glass rounded-xl px-4 py-2 flex items-center gap-2 min-w-[140px] sm:min-w-[180px] justify-center">
          {isLoadingYear ? (
            <Loader2 className="w-4 h-4 text-neon-green-400 animate-spin" />
          ) : (
            <Calendar className="w-4 h-4 text-neon-green-400" />
          )}
          <span className="text-lg sm:text-xl font-semibold text-white">{selectedYear}</span>
        </div>

        <button
          onClick={() => canGoForward && setSelectedYear(selectedYear + 1)}
          disabled={!canGoForward || isLoadingYear}
          className={cn(
            'p-2 rounded-xl transition-all',
            canGoForward && !isLoadingYear
              ? 'liquid-glass hover:bg-white/10 text-white/70 hover:text-white'
              : 'text-white/20 cursor-not-allowed'
          )}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Quick year jumps - horizontal scroll on mobile */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 px-1 -mx-1">
        {[2005, 2010, 2015, 2020, currentYear - 1, currentYear].filter((y, i, arr) => arr.indexOf(y) === i && y >= minYear).map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            disabled={isLoadingYear}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-shrink-0',
              selectedYear === year
                ? 'bg-neon-green-500/20 text-neon-green-400 border border-neon-green-500/30'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            )}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Controls - stacked on mobile */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Commit count control */}
        <div className="liquid-glass rounded-xl px-3 py-2 flex items-center justify-between sm:justify-start gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-neon-green-400" />
            <span className="text-sm text-white/50">Commits:</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCommitCount(Math.max(1, commitCount - 1))}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-neon-green-400 font-mono text-lg w-8 text-center font-semibold">
              {commitCount}
            </span>
            <button
              onClick={() => setCommitCount(Math.min(20, commitCount + 1))}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
            {/* Quick presets */}
            <div className="hidden sm:flex items-center gap-1 ml-2 border-l border-white/10 pl-2">
              {[1, 5, 10].map((count) => (
                <button
                  key={count}
                  onClick={() => setCommitCount(count)}
                  className={cn(
                    'px-2 py-1 rounded text-xs font-medium transition-all',
                    commitCount === count
                      ? 'bg-neon-green-500/20 text-neon-green-400'
                      : 'text-white/30 hover:text-white/60'
                  )}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions - full width on mobile */}
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {selectedDates.size > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={clearSelection}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear</span>
              </motion.button>
            )}
          </AnimatePresence>

          <button
            onClick={handleSubmit}
            disabled={selectedDates.size === 0 || isSubmitting}
            className={cn(
              'flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all text-sm',
              selectedDates.size > 0
                ? 'bg-neon-green-500 text-black hover:bg-neon-green-400'
                : 'bg-white/5 text-white/30 cursor-not-allowed'
            )}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Generate {totalCommits > 0 && `(${totalCommits})`}</span>
          </button>
        </div>
      </div>

      {/* Graph */}
      <motion.div
        ref={graphRef}
        key={selectedYear}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="liquid-glass rounded-2xl p-4 sm:p-6 relative overflow-x-auto"
      >
        {isLoadingYear && (
          <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center z-10">
            <Loader2 className="w-6 h-6 text-neon-green-400 animate-spin" />
          </div>
        )}
        <ContributionGraph
          weeks={displayWeeks}
          interactive
          selectedDates={selectedDates}
          onDateClick={handleDateClick}
          onDateHover={handleDateHover}
          year={selectedYear}
        />
      </motion.div>

      {/* Floating tooltip near cursor */}
      <AnimatePresence>
        {hoveredDay && tooltipPos && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            style={{
              position: 'fixed',
              left: tooltipPos.x,
              top: tooltipPos.y,
              transform: 'translate(-50%, -100%)',
            }}
            className="liquid-glass rounded-lg px-3 py-1.5 text-xs z-50 pointer-events-none whitespace-nowrap"
          >
            <span className="text-white/60">{hoveredDay.date}</span>
            <span className="mx-1.5 text-white/20">•</span>
            <span className="text-neon-green-400 font-medium">
              {hoveredDay.contributionCount}
            </span>
            {selectedDates.has(hoveredDay.date) && (
              <span className="text-white/40 ml-1">
                +{selectedDates.get(hoveredDay.date)}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <p className="text-center text-white/30 text-xs px-4">
        Tap dates to select • Swipe to scroll • Navigate years above
      </p>
    </div>
  );
}
