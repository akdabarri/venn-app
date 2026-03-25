"use client";

interface SkeletonCardProps {
  delay?: number;
}

function SkeletonLine({
  width = "w-full",
  height = "h-3",
}: {
  width?: string;
  height?: string;
}) {
  return (
    <div
      className={`${width} ${height} rounded-lg skeleton-shimmer`}
    />
  );
}

export function SkeletonCard({ delay = 0 }: SkeletonCardProps) {
  return (
    <div
      className="card-base p-5 sm:p-6 animate-fade-in"
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: "both",
      }}
    >
      <div className="space-y-4">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            {/* Rank circle */}
            <div className="w-7 h-7 rounded-full skeleton-shimmer shrink-0" />
            <div className="flex-1 space-y-2">
              <SkeletonLine width="w-4/5" height="h-4" />
              <SkeletonLine width="w-2/3" height="h-3" />
            </div>
          </div>
          {/* Quartile badge */}
          <div className="w-10 h-6 rounded-lg skeleton-shimmer shrink-0" />
        </div>

        {/* Meta row */}
        <div className="flex gap-6">
          <SkeletonLine width="w-24" height="h-3" />
          <SkeletonLine width="w-20" height="h-3" />
          <SkeletonLine width="w-16" height="h-3" />
        </div>

        {/* Category tags */}
        <div className="flex gap-2">
          <SkeletonLine width="w-24" height="h-6" />
          <SkeletonLine width="w-32" height="h-6" />
          <SkeletonLine width="w-20" height="h-6" />
        </div>

        {/* AI Reasoning block */}
        <div className="p-3.5 rounded-xl bg-[#fafafa] border border-[#f3f4f6] space-y-2">
          <SkeletonLine width="w-20" height="h-3" />
          <SkeletonLine width="w-full" height="h-2.5" />
          <SkeletonLine width="w-5/6" height="h-2.5" />
          <SkeletonLine width="w-4/6" height="h-2.5" />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-1">
          <SkeletonLine width="w-28" height="h-3" />
          <SkeletonLine width="w-20" height="h-3" />
        </div>
      </div>
    </div>
  );
}
