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
}

const levelColors = {
  NONE: 'contribution-none',
  FIRST_QUARTILE: 'contribution-first',
  SECOND_QUARTILE: 'contribution-second',
  THIRD_QUARTILE: 'contribution-third',
  FOURTH_QUARTILE: 'contribution-fourth',
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const days = ['', 'M', '', 'W', '', 'F', ''];

export function ContributionGraph({
  weeks,
  interactive = false,
  selectedDates,
  onDateClick,
  onDateHover,
  year,
}: ContributionGraphProps) {
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
    <div className="overflow-x-auto pb-2 -mx-2 px-2">
      <div className="inline-block min-w-max">
        {/* Month labels */}
        <div className="flex mb-1.5 pl-7">
          <div className="flex">
            {monthLabels.map((label, index) => {
              const nextLabel = monthLabels[index + 1];
              const width = nextLabel
                ? (nextLabel.weekIndex - label.weekIndex) * 13
                : (weeks.length - label.weekIndex) * 13;

              return (
                <div
                  key={`${label.month}-${index}`}
                  style={{ width: `${width}px` }}
                  className="text-[10px] text-white/30"
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
          <div className="flex flex-col justify-between mr-1.5 py-[1px]">
            {days.map((day, index) => (
              <div key={index} className="text-[10px] text-white/25 h-[10px] leading-[10px] w-5 text-right">
                {day}
              </div>
            ))}
          </div>

          {/* Weeks */}
          <div className="flex gap-[2px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[2px]">
                {week.contributionDays.map((day) => {
                  const isSelected = selectedDates?.has(day.date);
                  const isFuture = isCurrentYear && day.date > today;

                  return (
                    <motion.button
                      key={day.date}
                      whileHover={{ scale: interactive && !isFuture ? 1.5 : 1 }}
                      whileTap={{ scale: interactive && !isFuture ? 0.9 : 1 }}
                      onClick={() => {
                        if (interactive && !isFuture && onDateClick) {
                          onDateClick(day.date, day.contributionCount);
                        }
                      }}
                      onMouseEnter={(e) => onDateHover?.(day.date, day, e)}
                      onMouseLeave={() => onDateHover?.(null, null)}
                      onTouchStart={(e) => {
                        if (interactive && !isFuture) {
                          const touch = e.touches[0];
                          onDateHover?.(day.date, day, { clientX: touch.clientX, clientY: touch.clientY } as unknown as React.MouseEvent);
                        }
                      }}
                      disabled={!interactive || isFuture}
                      className={cn(
                        'w-[10px] h-[10px] rounded-[2px] transition-all duration-150',
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
        <div className="flex items-center justify-end gap-1.5 mt-3 text-[10px] text-white/30">
          <span>Less</span>
          <div className="flex gap-[2px]">
            <div className="w-[10px] h-[10px] rounded-[2px] contribution-none" />
            <div className="w-[10px] h-[10px] rounded-[2px] contribution-first" />
            <div className="w-[10px] h-[10px] rounded-[2px] contribution-second" />
            <div className="w-[10px] h-[10px] rounded-[2px] contribution-third" />
            <div className="w-[10px] h-[10px] rounded-[2px] contribution-fourth" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

export function generateEmptyYearData(year: number): ContributionWeek[] {
  const weeks: ContributionWeek[] = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

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
      if (currentWeek.some(d => d.date.startsWith(year.toString()))) {
        weeks.push({ contributionDays: currentWeek });
      }
      currentWeek = [];
    }

    currentDate.setDate(currentDate.getDate() + 1);

    if (currentDate.getFullYear() > year && currentWeek.length === 0) {
      break;
    }
  }

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
