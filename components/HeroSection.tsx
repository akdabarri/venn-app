"use client";

import { Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="pt-16 pb-10 px-6 text-center">
      {/* Badge */}
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fff7ef] border border-[#fde8d3] mb-6 animate-fade-up"
        style={{ animationFillMode: "both" }}
      >
        <Sparkles size={12} className="text-[#f36f21]" />
        <span className="text-xs font-medium text-[#f36f21] tracking-wide">
          AI-Powered · Scopus Indexed · 2024 Database
        </span>
      </div>

      {/* Headline */}
      <h1
        className="animate-fade-up delay-100 text-[2.5rem] sm:text-5xl font-bold leading-[1.1] tracking-tight text-[#171717] mb-4"
        style={{ animationFillMode: "both", fontFamily: "var(--font-serif)" }}
      >
        Find your perfect{" "}
        <span className="italic text-[#f36f21]">journal</span>
        <br />
        in seconds.
      </h1>

      {/* Subheadline */}
      <p
        className="animate-fade-up delay-200 text-base sm:text-lg text-[#6b7280] max-w-xl mx-auto leading-relaxed"
        style={{ animationFillMode: "both" }}
      >
        Paste your abstract, and Venn matches it against{" "}
        <strong className="text-[#333333] font-medium">thousands of Scopus journals</strong> using
        AI — so you can submit with confidence.
      </p>
    </section>
  );
}
