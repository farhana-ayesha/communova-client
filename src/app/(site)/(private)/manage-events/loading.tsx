import { Skeleton } from "@/components/ui/skeleton";

export default function ManageEventsLoading() {
  return (
    <div>
      <div className="border-t border-bark pt-6">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-5 h-12 w-[min(100%,420px)]" />
        <Skeleton className="mt-4 h-4 w-[min(100%,540px)]" />
      </div>

      <div className="mt-9 flex items-center justify-between border-y border-bark py-3">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-16" />
      </div>

      <div className="divide-y divide-bark">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="grid gap-4 py-5 sm:grid-cols-[132px_minmax(0,1fr)_auto] sm:items-center sm:gap-6"
          >
            <Skeleton className="aspect-[3/2] w-full border border-bark sm:w-[132px]" />
            <div className="space-y-3">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-9/12" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-9 w-40" />
          </div>
        ))}
      </div>
    </div>
  );
}
