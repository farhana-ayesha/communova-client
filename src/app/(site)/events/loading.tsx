import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * The register waits on a network call to the API, so the first paint is a
 * paper skeleton of the same grid rather than a blank page.
 */
export default function EventsLoading() {
  return (
    <Container className="py-10 md:py-14">
      <div className="border-t border-bark pt-6">
        <Skeleton className="h-3 w-36" />
        <Skeleton className="mt-6 h-12 w-[min(100%,420px)]" />
        <Skeleton className="mt-4 h-4 w-[min(100%,520px)]" />
      </div>

      <div className="mt-9 flex items-center justify-between border-y border-bark py-3">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-16" />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
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
              <Skeleton className="mt-4 h-4 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
