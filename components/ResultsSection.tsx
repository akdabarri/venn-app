"use client";

import { useEffect, useRef } from "react";
import { JournalCard } from "./JournalCard";
import { SkeletonCard } from "./SkeletonCard";
import type { RecommendationResult } from "@/lib/types";
import { Sparkles, AlertCircle } from "lucide-react";

interface ResultsSectionProps {
  isLoading: boolean;
  results: RecommendationResult[] | null;
}

export function ResultsSection({ isLoading, results }: ResultsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll into view when results appear
  useEffect(() => {
    if (!isLoading && results !== null) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [isLoading, results]);

  return (
    <div ref={sectionRef} className="mt-8 scroll-mt-24">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-5">
        <Sparkles size={15} className="text-[#f36f21]" />
        <h2 className="text-sm font-semibold text-[#333333] tracking-wide uppercase">
          {isLoading ? "Analyzing your abstract…" : "Top Journal Matches"}
        </h2>
        {!isLoading && results && (
          <span className="ml-auto text-xs text-[#9ca3af]">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Skeleton Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} delay={i * 80} />
          ))}
        </div>
      )}

      {/* Results */}
      {!isLoading && results && results.length > 0 && (
        <div className="space-y-4">
          {results.map((result, index) => (
            <JournalCard
              key={result.journal.Sourceid ?? index}
              result={result}
              rank={index + 1}
              delay={index * 100}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && results !== null && results.length === 0 && (
        <div className="card-base p-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#f9fafb] flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={22} className="text-[#9ca3af]" />
          </div>
          <h3 className="text-base font-semibold text-[#333333] mb-2">
            No matches found
          </h3>
          <p className="text-sm text-[#9ca3af] max-w-xs mx-auto">
            Try different keywords in your abstract, or uncheck the Free APC
            filter to expand your search.
          </p>
        </div>
      )}
    </div>
  );
}
