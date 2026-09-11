import { Container } from "@/components/layout/layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container className="py-8 sm:py-12">
      <div className="grid gap-px border border-line bg-line lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5 bg-canvas p-6 sm:p-10">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-20 w-full max-w-xl" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-11 w-44" />
        </div>
        <Skeleton className="min-h-80" />
      </div>
    </Container>
  );
}
