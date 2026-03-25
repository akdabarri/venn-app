"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Globe, BookOpen, TrendingUp, Sparkles, ExternalLink, BookmarkPlus, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { RecommendationResult } from "@/lib/types";

interface JournalCardProps {
  result: RecommendationResult;
  rank: number;
  delay?: number;
}

const QUARTILE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  Q1: { bg: "bg-[#f36f21]", text: "text-white", label: "Q1" },
  Q2: { bg: "bg-blue-500", text: "text-white", label: "Q2" },
  Q3: { bg: "bg-violet-500", text: "text-white", label: "Q3" },
  Q4: { bg: "bg-gray-400", text: "text-white", label: "Q4" },
  "-": { bg: "bg-gray-200", text: "text-gray-500", label: "N/A" },
};

function QuartileBadge({ quartile }: { quartile: string }) {
  const style = QUARTILE_STYLES[quartile] ?? QUARTILE_STYLES["-"];
  return (
    <span className={`quartile-badge ${style.bg} ${style.text}`} title={`SJR Best Quartile: ${style.label}`}>
      {style.label}
    </span>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const colors = [
    "text-[#f36f21] border-[#fde8d3] bg-[#fff7ef]",
    "text-blue-600 border-blue-100 bg-blue-50",
    "text-violet-600 border-violet-100 bg-violet-50",
  ];
  return (
    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full border text-xs font-bold ${colors[rank - 1] ?? colors[2]}`}>
      #{rank}
    </span>
  );
}

export function JournalCard({ result, rank, delay = 0 }: JournalCardProps) {
  const { journal, aiReasoning } = result;
  // Memanggil data user dari Clerk
  const { user, isSignedIn } = useUser(); 
  
  // State untuk tombol loading & sukses
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const quartile = journal["SJR Best Quartile"] ?? "-";
  const hIndex = typeof journal["H index"] === "number" ? journal["H index"] : parseInt(String(journal["H index"]), 10) || "—";

  const categoryList = journal.Categories
    ? journal.Categories.split(";").map((c) => c.replace(/\(Q\d\)/g, "").trim()).filter(Boolean).slice(0, 3)
    : [];

  // FUNGSI MENYIMPAN KE SUPABASE
  const handleSaveToHistory = async () => {
    if (!isSignedIn || !user) {
      alert("Please sign in to save this journal!");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from('saved_journals').insert([
        {
          user_id: user.id, // ID Unik user dari Clerk
          journal_title: journal.Title,
          journal_data: journal, // Seluruh data JSON jurnal
          ai_reasoning: aiReasoning // Hasil analisis dari Gemini
        }
      ]);

      if (error) throw error;
      
      setIsSaved(true);
    } catch (error) {
      console.error("Error saving to Supabase:", error);
      alert("Gagal menyimpan. Pastikan RLS di Supabase sudah dimatikan.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card-base card-hover animate-fade-up p-5 sm:p-6" style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}>
      <div className="space-y-4">
        
        {/* ── Top Row: Rank + Title + Quartile ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <RankBadge rank={rank} />
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-[#171717] leading-snug line-clamp-2">{journal.Title}</h3>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <QuartileBadge quartile={quartile} />
          </div>
        </div>

        {/* ── Meta Row ── */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#6b7280]">
          <span className="flex items-center gap-1.5">
            <TrendingUp size={13} className="text-[#f36f21] shrink-0" />
            <span>H-index: <strong className="text-[#333333] font-semibold">{hIndex}</strong></span>
          </span>
          {journal.Country && (
            <span className="flex items-center gap-1.5">
              <Globe size={13} className="text-[#f36f21] shrink-0" />
              <span>{journal.Country}</span>
            </span>
          )}
          {journal.is_free_apc && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-medium">
              ◆ Free APC
            </span>
          )}
        </div>

        {/* ── Category Tags ── */}
        {categoryList.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {categoryList.map((cat) => (
              <span key={cat} className="px-2.5 py-1 text-xs rounded-lg bg-[#f9fafb] border border-[#f0f0f0] text-[#6b7280]">{cat}</span>
            ))}
          </div>
        )}

        {/* ── AI Reasoning ── */}
        <div className="flex gap-3 p-3.5 rounded-xl bg-[#fafafa] border border-[#f3f4f6]">
          <Sparkles size={14} className="text-[#f36f21] mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-medium text-[#f36f21] mb-1">AI Reasoning</p>
            <p className="text-xs text-[#555555] leading-relaxed">{aiReasoning}</p>
          </div>
        </div>

        {/* ── Action Row (View in Scopus & Save) ── */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-4">
          <a
            href={`https://www.scopus.com/results/results.uri?src=s&sot=b&sdt=b&s=TITLE("${encodeURIComponent(journal.Title)}")`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-[#6b7280] hover:text-[#f36f21] transition-colors cursor-pointer"
          >
            <BookOpen size={12} /> View in Scopus <ExternalLink size={11} />
          </a>
          
          {/* TOMBOL SAVE KE DATABASE */}
          <button 
            onClick={handleSaveToHistory}
            disabled={isSaving || isSaved}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
              isSaved 
                ? 'bg-green-50 text-green-600' 
                : 'bg-[#f3f4f6] text-[#4b5563] hover:bg-[#e5e7eb] hover:text-[#111827]'
            }`}
          >
            {isSaved ? (
              <><CheckCircle2 size={14} /> Saved to History</>
            ) : isSaving ? (
              "Saving..."
            ) : (
              <><BookmarkPlus size={14} /> Save Journal</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}