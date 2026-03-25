"use client";

import { useState, useTransition, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { StatsBar } from "@/components/StatsBar";
import { InputCard } from "@/components/InputCard";
import { ResultsSection } from "@/components/ResultsSection";
import { Footer } from "@/components/Footer";
import type { RecommendationResult } from "@/lib/types";

export default function Home() {
  const { isSignedIn } = useUser();
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<RecommendationResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(async (searchData: { title: string; abstract: string; freeApcOnly: boolean }) => {
    setIsLoading(true);
    setResults(null);

    // MENGAMBIL API KEY DARI SETTINGS (LOCAL STORAGE)
    const apiKey = localStorage.getItem("venn_api_key") || "";

    requestAnimationFrame(() => {
      startTransition(async () => {
        try {
          const response = await fetch("/api/recommend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // MENGIRIM DATA + API KEY KE BACKEND
            body: JSON.stringify({ ...searchData, apiKey }), 
          });

          if (!response.ok) throw new Error("Gagal mengambil data dari server");
          
          // BACKEND SEKARANG MENGEMBALIKAN DATA LENGKAP DENGAN AI REASONING
          const finalResults: RecommendationResult[] = await response.json();
          setResults(finalResults);

        } catch (e) {
          console.error(e);
          alert("Terjadi kesalahan saat memproses data.");
        } finally {
          setIsLoading(false);
        }
      });
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-16">
        <HeroSection />
        <StatsBar />
        <div className="max-w-3xl mx-auto px-6 pb-24">
          <InputCard
            onSearchSubmit={handleSearch}
            isLoading={isLoading || isPending}
            isAuthenticated={!!isSignedIn}
          />
          <ResultsSection isLoading={isLoading || isPending} results={results} />
        </div>
      </main>
      <Footer />
    </div>
  );
}