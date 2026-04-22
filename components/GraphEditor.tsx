'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Save, Trash2, Loader2, Calendar, Plus, Minus,
  ChevronLeft, ChevronRight, Sparkles, ZoomIn, ZoomOut,
  MessageSquare, X, AlertTriangle
} from 'lucide-react';
import { ContributionGraph, generateEmptyYearData, type ContributionWeek, type ContributionDay } from './ContributionGraph';
import { TermsModal } from './TermsModal';
import { cn } from '@/utils/cn';

interface GraphEditorProps {
  initialWeeks: ContributionWeek[];
  termsAccepted?: boolean;
  onCommitsGenerated?: () => void;
}

interface TooltipPosition {
  x: number;
  y: number;
}

export function GraphEditor({ initialWeeks, termsAccepted: initialTermsAccepted = false, onCommitsGenerated }: GraphEditorProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [displayWeeks, setDisplayWeeks] = useState<ContributionWeek[]>(initialWeeks);
  const [isLoadingYear, setIsLoadingYear] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Map<string, number>>(new Map());
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
  const [tooltipPos, setTooltipPos] = useState<TooltipPosition | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commitCount, setCommitCount] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [showMsgInput, setShowMsgInput] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [deleteMode, setDeleteMode] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(initialTermsAccepted);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isAcceptingTerms, setIsAcceptingTerms] = useState(false);

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
    } catch {
      setDisplayWeeks(generateEmptyYearData(year));
    } finally {
      setIsLoadingYear(false);
    }
  }, [currentYear, initialWeeks]);

  useEffect(() => {
    fetchYearContributions(selectedYear);
  }, [selectedYear, fetchYearContributions]);

  const handleDateClick = useCallback((date: string) => {
    if (deleteMode) {
      toast.info('Individual commit deletion not supported. Use Settings → Recreate Repository to clear all.');
      return;
    }
    setSelectedDates((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(date)) {
        newMap.delete(date);
      } else {
        newMap.set(date, commitCount);
      }
      return newMap;
    });
  }, [commitCount, deleteMode]);

  const handleDateHover = useCallback((date: string | null, day: ContributionDay | null, event?: React.MouseEvent) => {
    setHoveredDay(day);
    if (day && event) {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 8 });
    } else {
      setTooltipPos(null);
    }
  }, []);

  const handleAcceptTerms = async () => {
    setIsAcceptingTerms(true);
    try {
      const response = await fetch('/api/terms', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to save');
      setTermsAccepted(true);
      setShowTermsModal(false);
      // Now proceed with generation
      await generateCommits();
    } catch {
      toast.error('Failed to save preference');
    } finally {
      setIsAcceptingTerms(false);
    }
  };

  const generateCommits = async () => {
    setIsSubmitting(true);
    try {
      const commits = Array.from(selectedDates.entries()).map(([date, count]) => ({ date, count }));
      const response = await fetch('/api/commits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commits,
          customMessage: customMsg || null
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      toast.success(data.message);
      setSelectedDates(new Map());
      onCommitsGenerated?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (selectedDates.size === 0) return toast.error('Select at least one date');

    if (!termsAccepted) {
      setShowTermsModal(true);
      return;
    }

    await generateCommits();
  };

  const totalCommits = Array.from(selectedDates.values()).reduce((sum, count) => sum + count, 0);
  const minYear = 2000;
  const canGoBack = selectedYear > minYear;
  const canGoForward = selectedYear < currentYear;

  return (
    <div className="space-y-4">
      {/* Submitting overlay */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <div className="liquid-glass rounded-2xl p-6 text-center max-w-xs">
              <Loader2 className="w-10 h-10 text-neon-green-400 animate-spin mx-auto mb-4" />
              <p className="text-white font-medium mb-2">Generating {totalCommits} commits...</p>
              <p className="text-white/40 text-xs flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                Don&apos;t close this tab
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Year Selector */}
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        <button onClick={() => canGoBack && setSelectedYear(selectedYear - 1)} disabled={!canGoBack || isLoadingYear} className={cn('p-2 rounded-xl transition-all', canGoBack && !isLoadingYear ? 'liquid-glass hover:bg-white/10 text-white/70' : 'text-white/20 cursor-not-allowed')}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="liquid-glass rounded-xl px-4 py-2 flex items-center gap-2 min-w-[140px] justify-center">
          {isLoadingYear ? <Loader2 className="w-4 h-4 text-neon-green-400 animate-spin" /> : <Calendar className="w-4 h-4 text-neon-green-400" />}
          <span className="text-lg font-semibold text-white">{selectedYear}</span>
        </div>
        <button onClick={() => canGoForward && setSelectedYear(selectedYear + 1)} disabled={!canGoForward || isLoadingYear} className={cn('p-2 rounded-xl transition-all', canGoForward && !isLoadingYear ? 'liquid-glass hover:bg-white/10 text-white/70' : 'text-white/20 cursor-not-allowed')}>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Quick years */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 px-1">
        {[2005, 2010, 2015, 2020, currentYear - 1, currentYear].filter((y, i, arr) => arr.indexOf(y) === i && y >= minYear).map((year) => (
          <button key={year} onClick={() => setSelectedYear(year)} disabled={isLoadingYear} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-shrink-0', selectedYear === year ? 'bg-neon-green-500/20 text-neon-green-400 border border-neon-green-500/30' : 'text-white/40 hover:text-white/70 hover:bg-white/5')}>
            {year}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="liquid-glass rounded-xl px-3 py-2 flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-neon-green-400" />
            <div className="flex items-center gap-1">
              <button onClick={() => setCommitCount(Math.max(1, commitCount - 1))} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50"><Minus className="w-3 h-3" /></button>
              <span className="text-neon-green-400 font-mono text-lg w-8 text-center font-semibold">{commitCount}</span>
              <button onClick={() => setCommitCount(Math.min(15, commitCount + 1))} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50"><Plus className="w-3 h-3" /></button>
            </div>
          </div>

          {/* Custom message toggle */}
          <button onClick={() => setShowMsgInput(!showMsgInput)} className={cn('p-2.5 rounded-xl transition-all', showMsgInput ? 'bg-neon-green-500/20 text-neon-green-400' : 'liquid-glass text-white/50 hover:text-white')}>
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Delete mode toggle */}
          <button onClick={() => { setDeleteMode(!deleteMode); if (!deleteMode) toast.info('Delete mode: Click commits to see info. Use Settings to clear all.'); }} className={cn('p-2.5 rounded-xl transition-all', deleteMode ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'liquid-glass text-white/50 hover:text-white')}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <AnimatePresence>
            {selectedDates.size > 0 && !deleteMode && (
              <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onClick={() => setSelectedDates(new Map())} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass text-white/50 hover:text-red-400 hover:bg-red-500/10 text-sm">
                <X className="w-4 h-4" /><span>Clear</span>
              </motion.button>
            )}
          </AnimatePresence>
          {!deleteMode && (
            <button onClick={handleSubmit} disabled={selectedDates.size === 0 || isSubmitting} className={cn('flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm', selectedDates.size > 0 ? 'bg-neon-green-500 text-black hover:bg-neon-green-400' : 'bg-white/5 text-white/30 cursor-not-allowed')}>
              <Save className="w-4 h-4" />
              <span>Generate {totalCommits > 0 && `(${totalCommits})`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Custom message input */}
      <AnimatePresence>
        {showMsgInput && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="liquid-glass rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-white/50">Custom commit message</label>
              <button onClick={() => { setCustomMsg(''); setShowMsgInput(false); }} className="text-xs text-white/30 hover:text-white/50">Reset to default</button>
            </div>
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="Commitify: {username} Contribution {date}"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-neon-green-500/50"
            />
            <p className="text-[11px] text-white/30">Use <code className="text-neon-green-400/70">{'{username}'}</code> and <code className="text-neon-green-400/70">{'{date}'}</code> as placeholders</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete mode banner */}
      <AnimatePresence>
        {deleteMode && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="liquid-glass rounded-xl p-3 border border-red-500/20 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-white/70">Individual commits cannot be deleted via GitHub API.</p>
              <p className="text-white/40 text-xs mt-1">To clear all Commitify commits, go to Settings → Recreate Repository.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zoom - desktop */}
      <div className="hidden sm:flex items-center justify-end gap-2">
        <span className="text-xs text-white/30">Zoom:</span>
        <button onClick={() => setZoom(Math.max(0.8, zoom - 0.1))} className="p-1.5 rounded-lg glass text-white/50 hover:text-white"><ZoomOut className="w-4 h-4" /></button>
        <span className="text-xs text-white/50 w-10 text-center">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(Math.min(1.5, zoom + 0.1))} className="p-1.5 rounded-lg glass text-white/50 hover:text-white"><ZoomIn className="w-4 h-4" /></button>
        <button onClick={() => setZoom(1)} className="px-2 py-1 rounded-lg text-xs text-white/30 hover:text-white/50">Reset</button>
      </div>

      {/* Graph */}
      <motion.div key={selectedYear} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn('liquid-glass rounded-2xl p-4 sm:p-6 relative overflow-x-auto', deleteMode && 'border border-red-500/20')}>
        {isLoadingYear && (
          <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center z-10">
            <Loader2 className="w-6 h-6 text-neon-green-400 animate-spin" />
          </div>
        )}
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', width: zoom !== 1 ? `${100 / zoom}%` : '100%' }}>
          <ContributionGraph weeks={displayWeeks} interactive={!deleteMode} selectedDates={selectedDates} onDateClick={handleDateClick} onDateHover={handleDateHover} year={selectedYear} deleteMode={deleteMode} />
        </div>
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredDay && tooltipPos && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} style={{ position: 'fixed', left: tooltipPos.x, top: tooltipPos.y, transform: 'translate(-50%, -100%)' }} className="liquid-glass rounded-lg px-3 py-1.5 text-xs z-50 pointer-events-none whitespace-nowrap">
            <span className="text-white/60">{hoveredDay.date}</span>
            <span className="mx-1.5 text-white/20">•</span>
            <span className="text-neon-green-400 font-medium">{hoveredDay.contributionCount}</span>
            {selectedDates.has(hoveredDay.date) && <span className="text-white/40 ml-1">+{selectedDates.get(hoveredDay.date)}</span>}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-center text-white/30 text-xs">
        Tap dates to select • <span className="sm:hidden">Swipe to scroll • </span>Navigate years above
      </p>

      {/* Terms Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={handleAcceptTerms}
        isLoading={isAcceptingTerms}
      />
    </div>
  );
}
