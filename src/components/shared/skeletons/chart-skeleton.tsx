import { Skeleton } from "@/components/ui/skeleton";

export function ChartSkeleton() {
  return (
    <div className="rounded-xl border p-6 space-y-4">
      <div className="space-y-1">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-[250px] w-full" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
}