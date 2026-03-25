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

  // Auto-scroll saat hasil muncul agar user tidak bingung
  useEffect(() => {
    if (!isLoading && results !== null && results.length > 0) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  }, [isLoading, results]);

  return (
    <div ref={sectionRef} className="mt-8 scroll-mt-24">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="p-1.5 bg-[#fff7ef] rounded-lg">
          <Sparkles size={16} className="text-[#f36f21]" />
        </div>
        <h2 className="text-sm font-bold text-[#171717] tracking-wider uppercase">
          {isLoading ? "Analyzing Research Scope…" : "Top Journal Matches"}
        </h2>
        {!isLoading && results && (
          <span className="ml-auto text-[11px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
            {results.length} Journals Found
          </span>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} delay={i * 80} />
          ))}
        </div>
      )}

      {/* Results List */}
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
        <div className="card-base p-12 text-center border-dashed border-2">
          <div className="w-14 h-14 rounded-2xl bg-[#f9fafb] flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} className="text-[#9ca3af]" />
          </div>
          <h3 className="text-lg font-bold text-[#333333] mb-2">
            No optimal matches found
          </h3>
          <p className="text-sm text-[#9ca3af] max-w-sm mx-auto leading-relaxed">
            AI couldn't find a perfect match. Try refining your abstract or 
            disabling the <span className="text-[#f36f21] font-medium">Free APC filter</span> to see more options.
          </p>
        </div>
      )}
    </div>
  );
}