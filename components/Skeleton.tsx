import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('skeleton rounded-lg', className)} />;
}

export function ContributionGraphSkeleton() {
  return (
    <div className="liquid-glass rounded-2xl p-3 sm:p-6">
      <div className="space-y-3">
        <div className="flex gap-3 pl-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-2.5 w-5" />
          ))}
        </div>

        <div className="flex gap-1">
          <div className="flex flex-col gap-[2px] mr-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-[10px] w-4" />
            ))}
          </div>

          <div className="flex gap-[2px] overflow-hidden">
            {Array.from({ length: 30 }).map((_, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[2px]">
                {Array.from({ length: 7 }).map((_, dayIndex) => (
                  <Skeleton key={dayIndex} className="w-[10px] h-[10px] rounded-[2px]" />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Skeleton className="h-2.5 w-20" />
        </div>
      </div>
    </div>
  );
}

export function UserCardSkeleton() {
  return (
    <div className="liquid-glass rounded-2xl p-4 sm:p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex-shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="liquid-glass rounded-xl p-2.5 sm:p-4">
          <div className="flex items-center gap-1.5 mb-1 sm:mb-2">
            <Skeleton className="h-6 w-6 rounded-lg" />
          </div>
          <Skeleton className="h-5 sm:h-7 w-10" />
        </div>
      ))}
    </div>
  );
}
