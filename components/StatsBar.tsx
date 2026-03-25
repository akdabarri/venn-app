"use client";

import { Database, Globe, Award, Zap } from "lucide-react";

const STATS = [
  {
    icon: Database,
    value: "21,000+",
    label: "Scopus Journals",
  },
  {
    icon: Globe,
    value: "239",
    label: "Countries Covered",
  },
  {
    icon: Award,
    value: "2024",
    label: "SJR Edition",
  },
  {
    icon: Zap,
    value: "<3s",
    label: "Average Match Time",
  },
];

export function StatsBar() {
  return (
    <div className="max-w-3xl mx-auto px-6 pb-8">
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-up delay-200"
        style={{ animationFillMode: "both" }}
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-1.5 p-4 rounded-xl bg-[#fafafa] border border-[#f0f0f0] text-center"
            style={{ animationDelay: `${i * 60 + 200}ms` }}
          >
            <stat.icon size={15} className="text-[#f36f21]" />
            <span className="text-base font-bold text-[#171717] tabular-nums">
              {stat.value}
            </span>
            <span className="text-[11px] text-[#9ca3af] leading-none">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
