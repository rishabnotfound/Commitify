import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('skeleton rounded-lg', className)} />
  );
}

export function ContributionGraphSkeleton() {
  return (
    <div className="liquid-glass rounded-2xl p-6">
      <div className="space-y-4">
        {/* Month labels */}
        <div className="flex gap-4 pl-10">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-6" />
          ))}
        </div>

        {/* Graph grid */}
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] mr-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-[12px] w-6" />
            ))}
          </div>

          {/* Weeks */}
          <div className="flex gap-[3px]">
            {Array.from({ length: 52 }).map((_, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }).map((_, dayIndex) => (
                  <Skeleton key={dayIndex} className="w-[12px] h-[12px] rounded-[3px]" />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-end">
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
}

export function UserCardSkeleton() {
  return (
    <div className="liquid-glass rounded-2xl p-6">
      <div className="flex items-center gap-6">
        <Skeleton className="w-20 h-20 rounded-2xl" />
        <div className="space-y-3 flex-1">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="liquid-glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-7 w-7 rounded-lg" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-8 w-14" />
        </div>
      ))}
    </div>
  );
}
