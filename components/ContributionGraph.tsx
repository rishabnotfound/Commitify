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
  onDateHover?: (date: string | null, day: ContributionDay | null) => void;
  year?: number;
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

export function ContributionGraph({
  weeks,
  interactive = false,
  selectedDates,
  onDateClick,
  onDateHover,
  year,
}: ContributionGraphProps) {
  // Calculate month labels based on the first day of each month
  const monthLabels: { month: string; weekIndex: number }[] = [];
  let lastMonth = -1;

  weeks.forEach((week, weekIndex) => {
    const firstDay = week.contributionDays[0];
    if (firstDay) {
      const date = new Date(firstDay.date);
      const month = date.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ month: months[month], weekIndex });
        lastMonth = month;
      }
    }
  });

  const today = new Date().toISOString().split('T')[0];
  const currentYear = new Date().getFullYear();
  const isCurrentYear = !year || year === currentYear;

  return (
    <div className="overflow-x-auto pb-2">
      <div className="inline-block min-w-full">
        {/* Month labels */}
        <div className="flex mb-2 pl-10">
          <div className="flex">
            {monthLabels.map((label, index) => {
              const nextLabel = monthLabels[index + 1];
              const width = nextLabel
                ? (nextLabel.weekIndex - label.weekIndex) * 15
                : (weeks.length - label.weekIndex) * 15;

              return (
                <div
                  key={`${label.month}-${index}`}
                  style={{ width: `${width}px` }}
                  className="text-xs text-white/40"
                >
                  {label.month}
                </div>
              );
            })}
          </div>
        </div>

        {/* Graph */}
        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col justify-between mr-2 py-[2px]">
            {days.map((day, index) => (
              <div key={index} className="text-xs text-white/30 h-[12px] leading-[12px] w-6 text-right pr-1">
                {day}
              </div>
            ))}
          </div>

          {/* Weeks */}
          <div className="flex gap-[3px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.contributionDays.map((day) => {
                  const isSelected = selectedDates?.has(day.date);
                  const selectedCount = selectedDates?.get(day.date) || 0;
                  const isFuture = isCurrentYear && day.date > today;

                  return (
                    <motion.button
                      key={day.date}
                      whileHover={{ scale: interactive && !isFuture ? 1.4 : 1 }}
                      whileTap={{ scale: interactive && !isFuture ? 0.9 : 1 }}
                      onClick={() => {
                        if (interactive && !isFuture && onDateClick) {
                          onDateClick(day.date, day.contributionCount);
                        }
                      }}
                      onMouseEnter={() => onDateHover?.(day.date, day)}
                      onMouseLeave={() => onDateHover?.(null, null)}
                      disabled={!interactive || isFuture}
                      className={cn(
                        'w-[12px] h-[12px] rounded-[3px] transition-all duration-200',
                        levelColors[day.contributionLevel],
                        interactive && !isFuture && 'cursor-pointer hover:brightness-125',
                        isFuture && 'opacity-20 cursor-not-allowed',
                        isSelected && 'contribution-selected'
                      )}
                      title={`${day.date}: ${day.contributionCount} contributions${selectedCount > 0 ? ` (+${selectedCount} pending)` : ''}`}
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
          <div className="flex gap-[3px]">
            <div className="w-[12px] h-[12px] rounded-[3px] contribution-none" />
            <div className="w-[12px] h-[12px] rounded-[3px] contribution-first" />
            <div className="w-[12px] h-[12px] rounded-[3px] contribution-second" />
            <div className="w-[12px] h-[12px] rounded-[3px] contribution-third" />
            <div className="w-[12px] h-[12px] rounded-[3px] contribution-fourth" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

// Generate empty graph data for a specific year
export function generateEmptyYearData(year: number): ContributionWeek[] {
  const weeks: ContributionWeek[] = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  // Adjust start to the previous Sunday
  const startDay = startDate.getDay();
  startDate.setDate(startDate.getDate() - startDay);

  const currentDate = new Date(startDate);
  let currentWeek: ContributionDay[] = [];

  while (currentDate <= endDate || currentWeek.length > 0) {
    const dateString = currentDate.toISOString().split('T')[0];

    currentWeek.push({
      date: dateString,
      contributionCount: 0,
      contributionLevel: 'NONE',
    });

    if (currentWeek.length === 7) {
      // Only include weeks that have at least one day in the target year
      if (currentWeek.some(d => d.date.startsWith(year.toString()))) {
        weeks.push({ contributionDays: currentWeek });
      }
      currentWeek = [];
    }

    currentDate.setDate(currentDate.getDate() + 1);

    // Stop if we've passed the year and completed the week
    if (currentDate.getFullYear() > year && currentWeek.length === 0) {
      break;
    }
  }

  // Handle remaining days
  if (currentWeek.length > 0 && currentWeek.some(d => d.date.startsWith(year.toString()))) {
    while (currentWeek.length < 7) {
      const dateString = currentDate.toISOString().split('T')[0];
      currentWeek.push({
        date: dateString,
        contributionCount: 0,
        contributionLevel: 'NONE',
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push({ contributionDays: currentWeek });
  }

  return weeks;
}
