import { Skeleton } from "@/components/ui/skeleton";

export default function JoinedEventsLoading() {
  return (
    <div>
      <div className="border-t border-bark pt-6">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-5 h-12 w-[min(100%,460px)]" />
        <Skeleton className="mt-4 h-4 w-[min(100%,540px)]" />
      </div>

      <div className="mt-9 border-b border-bark pb-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-8 w-64" />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border border-bark bg-card">
            <Skeleton className="aspect-[3/2] w-full border-b border-bark" />
            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-6 w-11/12" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
