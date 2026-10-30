import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventDetailLoading() {
  return (
    <Container className="py-8 md:py-12">
      <div className="flex items-center justify-between border-t border-bark pt-5">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-6 w-20" />
      </div>

      <Skeleton className="mt-6 h-3 w-52" />
      <Skeleton className="mt-4 h-12 w-[min(100%,520px)]" />
      <Skeleton className="mt-8 aspect-[16/9] w-full border border-bark md:aspect-[21/9]" />

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-3 lg:col-span-7">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-10/12" />
          <Skeleton className="h-4 w-8/12" />
          <div className="mt-8 grid gap-px border border-bark bg-bark sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-card p-5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="mt-3 h-5 w-32" />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="border border-bark bg-card">
            <div className="border-b border-bark px-5 py-3">
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="space-y-4 p-5">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-6 w-44" />
              <Skeleton className="mt-5 h-3 w-14" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="mt-6 h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
