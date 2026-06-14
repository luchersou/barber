import { Skeleton } from "@/components/ui/skeleton";

export function CalendarSkeleton() {
  return (
    <div className="rounded-lg border space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-16" />
          <div className="flex gap-1">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-36" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="min-h-[100px] border p-1 space-y-1">
            <Skeleton className="h-4 w-6" />
            {i % 5 === 0 && <Skeleton className="h-5 w-full" />}
            {i % 7 === 0 && <Skeleton className="h-5 w-3/4" />}
          </div>
        ))}
      </div>
    </div>
  );
}