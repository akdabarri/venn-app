"use client";

import { useState, useTransition, useCallback, useEffect } from "react";
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
  
  // State untuk memulihkan input teks (Judul & Abstrak)
  const [lastSearchData, setLastSearchData] = useState<{title: string, abstract: string, freeApcOnly: boolean} | null>(null);

  // ==========================================================
  // EFFECT: PERSISTENCE RECOVERY (Pulihkan Hasil & Input)
  // ==========================================================
  useEffect(() => {
    const savedResults = localStorage.getItem("besbi_last_search_results");
    const savedInputs = localStorage.getItem("besbi_last_search_inputs");
    
    if (savedResults) {
      try { setResults(JSON.parse(savedResults)); } catch (e) { console.error(e); }
    }
    
    if (savedInputs) {
      try { setLastSearchData(JSON.parse(savedInputs)); } catch (e) { console.error(e); }
    }
  }, []);

  const handleSearch = useCallback(async (searchData: { title: string; abstract: string; freeApcOnly: boolean }) => {
    if (typeof window === "undefined") return;

    // 1. Ambil Konfigurasi dari LocalStorage
    const rawKey = localStorage.getItem("venn_api_key")?.trim() || "";
    const savedApiType = localStorage.getItem("venn_api_type") || "gemini";
    const modelPref = localStorage.getItem("besbi_model_pref") || "fast"; // Ambil preferensi model (fast/smart)

    if (!rawKey) {
      alert("⚠️ API Key not found! Please enter your key in Settings.");
      return;
    }

    // 2. Simpan Input Saat Ini ke Cache (Agar tidak hilang saat pindah page)
    localStorage.setItem("besbi_last_search_inputs", JSON.stringify(searchData));
    setLastSearchData(searchData);

    // 3. RUMUS SCRIPT AUTO-DETECT (Logic Anti-Salah Kamar)
    let detectedApiType = savedApiType; 
    if (rawKey.startsWith("gsk_")) {
      detectedApiType = "groq";
    } else if (rawKey.startsWith("sk-")) {
      detectedApiType = "openai";
    } else if (rawKey.startsWith("AIza")) {
      detectedApiType = "gemini";
    }

    console.log(`--- Besbi Search [${detectedApiType} | ${modelPref}] ---`);

    setIsLoading(true);
    setResults(null);
    localStorage.removeItem("besbi_last_search_results");

    requestAnimationFrame(() => {
      startTransition(async () => {
        try {
          const response = await fetch("/api/recommend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              ...searchData, 
              apiKey: rawKey, 
              apiType: detectedApiType,
              modelPref: modelPref // Mengirim instruksi Intelligence Level ke backend
            }), 
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Server error");
          }
          
          const finalResults: RecommendationResult[] = await response.json();
          
          // 4. Simpan Hasil Akhir ke Cache
          setResults(finalResults);
          localStorage.setItem("besbi_last_search_results", JSON.stringify(finalResults));

        } catch (e: any) {
          console.error("Search Error:", e);
          alert(e.message || "An error occurred.");
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
            initialData={lastSearchData} // Mengirim data lama kembali ke form
          />
          <div className="mt-12 scroll-mt-24">
            <ResultsSection isLoading={isLoading || isPending} results={results} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}