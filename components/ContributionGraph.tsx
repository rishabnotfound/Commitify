'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE';
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionGraphProps {
  weeks: ContributionWeek[];
  interactive?: boolean;
  selectedDates?: Map<string, number>;
  onDateClick?: (date: string, currentCount: number) => void;
  onDateHover?: (date: string | null, day: ContributionDay | null, event?: React.MouseEvent) => void;
  year?: number;
  deleteMode?: boolean;
}

const levelColors = {
  NONE: 'contribution-none',
  FIRST_QUARTILE: 'contribution-first',
  SECOND_QUARTILE: 'contribution-second',
  THIRD_QUARTILE: 'contribution-third',
  FOURTH_QUARTILE: 'contribution-fourth',
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const days = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

// Normalize weeks to ensure proper padding at start of year
function normalizeWeeks(weeks: ContributionWeek[], year: number): ContributionWeek[] {
  if (!weeks.length) return weeks;

  const result = [...weeks.map(w => ({ contributionDays: [...w.contributionDays] }))];

  // Check first week - pad with empty days before Jan 1
  const firstWeek = result[0];
  if (firstWeek && firstWeek.contributionDays.length > 0) {
    const firstDay = firstWeek.contributionDays[0];
    const firstDate = new Date(firstDay.date);

    // If first day is Jan 1 of target year, we need to add padding
    if (firstDate.getMonth() === 0 && firstDate.getDate() === 1 && firstDate.getFullYear() === year) {
      const dayOfWeek = firstDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

      // Add empty days before Jan 1
      const paddingDays: ContributionDay[] = [];
      for (let i = 0; i < dayOfWeek; i++) {
        const paddingDate = new Date(year - 1, 11, 31 - (dayOfWeek - 1 - i)); // Dec dates from prev year
        paddingDays.push({
          date: paddingDate.toISOString().split('T')[0],
          contributionCount: 0,
          contributionLevel: 'NONE'
        });
      }
      firstWeek.contributionDays = [...paddingDays, ...firstWeek.contributionDays];
    }
  }

  return result;
}

export function ContributionGraph({ weeks, interactive = false, selectedDates, onDateClick, onDateHover, year }: ContributionGraphProps) {
  const displayYear = year || new Date().getFullYear();

  // Normalize weeks - ensure first week has proper padding for days before Jan 1
  const normalizedWeeks = normalizeWeeks(weeks, displayYear);

  const monthLabels: { month: string; weekIndex: number }[] = [];
  let lastMonth = -1;

  normalizedWeeks.forEach((week, weekIndex) => {
    // Find first day that's actually in the target year
    const firstDayInYear = week.contributionDays.find(d => d.date.startsWith(displayYear.toString()));
    if (firstDayInYear) {
      const month = new Date(firstDayInYear.date).getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ month: months[month], weekIndex });
        lastMonth = month;
      }
    }
  });

  const today = new Date().toISOString().split('T')[0];
  const currentYear = new Date().getFullYear();
  const isCurrentYear = !year || year === currentYear;

  // Cell size - bigger for better visibility
  const cellSize = 14;
  const gap = 3;

  return (
    <div className="w-full">
      {/* Month labels */}
      <div className="flex mb-2" style={{ paddingLeft: 36 }}>
        {monthLabels.map((label, index) => {
          const nextLabel = monthLabels[index + 1];
          const width = nextLabel ? (nextLabel.weekIndex - label.weekIndex) * (cellSize + gap) : (weeks.length - label.weekIndex) * (cellSize + gap);
          return (
            <div key={`${label.month}-${index}`} style={{ width }} className="text-xs text-white/40">
              {label.month}
            </div>
          );
        })}
      </div>

      {/* Graph */}
      <div className="flex">
        {/* Day labels */}
        <div className="flex flex-col justify-between mr-2" style={{ height: 7 * cellSize + 6 * gap }}>
          {days.map((day, index) => (
            <div key={index} className="text-[11px] text-white/30 w-7 text-right pr-1" style={{ height: cellSize, lineHeight: `${cellSize}px` }}>
              {day}
            </div>
          ))}
        </div>

        {/* Weeks */}
        <div className="flex" style={{ gap }}>
          {normalizedWeeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col" style={{ gap }}>
              {week.contributionDays.map((day) => {
                const isSelected = selectedDates?.has(day.date);
                const isFuture = isCurrentYear && day.date > today;
                const dayYear = parseInt(day.date.split('-')[0]);
                const isOutsideYear = dayYear !== displayYear;

                // Render invisible placeholder for days outside the year
                if (isOutsideYear) {
                  return (
                    <div
                      key={day.date}
                      style={{ width: cellSize, height: cellSize }}
                      className="opacity-0"
                    />
                  );
                }

                return (
                  <motion.button
                    key={day.date}
                    whileHover={{ scale: interactive && !isFuture ? 1.3 : 1 }}
                    whileTap={{ scale: interactive && !isFuture ? 0.9 : 1 }}
                    onClick={() => interactive && !isFuture && onDateClick?.(day.date, day.contributionCount)}
                    onMouseEnter={(e) => onDateHover?.(day.date, day, e)}
                    onMouseLeave={() => onDateHover?.(null, null)}
                    disabled={!interactive || isFuture}
                    style={{ width: cellSize, height: cellSize }}
                    className={cn(
                      'rounded-sm transition-all duration-150',
                      levelColors[day.contributionLevel],
                      interactive && !isFuture && 'cursor-pointer hover:brightness-125',
                      isFuture && 'opacity-20 cursor-not-allowed',
                      isSelected && 'contribution-selected'
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-white/40">
        <span>Less</span>
        <div className="flex" style={{ gap: 3 }}>
          {['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'].map((level) => (
            <div key={level} style={{ width: cellSize, height: cellSize }} className={`rounded-sm ${levelColors[level as keyof typeof levelColors]}`} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

export function generateEmptyYearData(year: number): ContributionWeek[] {
  const weeks: ContributionWeek[] = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const currentDate = new Date(startDate);
  let currentWeek: ContributionDay[] = [];

  while (currentDate <= endDate || currentWeek.length > 0) {
    currentWeek.push({ date: currentDate.toISOString().split('T')[0], contributionCount: 0, contributionLevel: 'NONE' });
    if (currentWeek.length === 7) {
      if (currentWeek.some(d => d.date.startsWith(year.toString()))) weeks.push({ contributionDays: currentWeek });
      currentWeek = [];
    }
    currentDate.setDate(currentDate.getDate() + 1);
    if (currentDate.getFullYear() > year && currentWeek.length === 0) break;
  }

  if (currentWeek.length > 0 && currentWeek.some(d => d.date.startsWith(year.toString()))) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: currentDate.toISOString().split('T')[0], contributionCount: 0, contributionLevel: 'NONE' });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push({ contributionDays: currentWeek });
  }

  return weeks;
}
