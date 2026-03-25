"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Globe, BookOpen, TrendingUp, Sparkles, ExternalLink, BookmarkPlus, CheckCircle2, Trash2, Search, GraduationCap } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { RecommendationResult } from "@/lib/types";

interface JournalCardProps {
  result: RecommendationResult;
  rank: number;
  delay?: number;
  isHistoryPage?: boolean; 
  onDelete?: () => void;   
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

export function JournalCard({ result, rank, delay = 0, isHistoryPage = false, onDelete }: JournalCardProps) {
  const { journal, aiReasoning } = result;
  const { user, isSignedIn } = useUser(); 
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ==========================================================
  // LOGIKA LINK CERDAS (The Direct Access) - FIXED FOR SCIMAGO
  // ==========================================================
  const journalTitleRaw = journal.Title;
  const journalNameEncoded = encodeURIComponent(journalTitleRaw);
  const issn = journal.Issn?.split(',')[0].trim() || "";
  
  // Perbaikan Scimago: Jika ISSN ada, gunakan ISSN. Jika tidak, gunakan Judul.
  const scimagoQuery = issn ? issn : journalTitleRaw;
  const scimagoLink = `https://www.scimagojr.com/journalsearch.php?q=${encodeURIComponent(scimagoQuery)}`;
  
  const websiteSearch = `https://www.google.com/search?q=official+website+journal+${journalNameEncoded}+${issn}`;
  const scholarLink = `https://scholar.google.com/scholar?q=source:%22${journalNameEncoded}%22`;

  const quartile = journal["SJR Best Quartile"] ?? "-";
  const hIndex = typeof journal["H index"] === "number" ? journal["H index"] : parseInt(String(journal["H index"]), 10) || "—";

  const categoryList = journal.Categories
    ? journal.Categories.split(";").map((c) => c.replace(/\(Q\d\)/g, "").trim()).filter(Boolean).slice(0, 3)
    : [];

  const handleSaveToHistory = async () => {
    if (!isSignedIn || !user) {
      alert("Please sign in to save this journal!");
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase.from('saved_journals').insert([
        {
          user_id: user.id,
          journal_title: journal.Title,
          journal_data: journal,
          ai_reasoning: aiReasoning 
        }
      ]);
      if (error) throw error;
      setIsSaved(true);
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFromHistory = async () => {
    if (!window.confirm("Remove this journal from history?")) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('saved_journals')
        .delete()
        .eq('journal_title', journal.Title)
        .eq('user_id', user?.id);
      if (error) throw error;
      if (onDelete) onDelete();
    } catch (error) {
      alert("Failed to delete.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="card-base card-hover animate-fade-up p-5 sm:p-6" style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}>
      <div className="space-y-4">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <RankBadge rank={rank} />
            <div className="min-w-0">
              <h3 className="text-base font-bold text-[#171717] leading-snug line-clamp-2">{journal.Title}</h3>
              {issn && <p className="text-[10px] text-gray-400 mt-0.5 font-mono">ISSN: {issn}</p>}
            </div>
          </div>
          <QuartileBadge quartile={quartile} />
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#6b7280]">
          <span className="flex items-center gap-1.5">
            <TrendingUp size={13} className="text-[#f36f21]" />
            <span>H-index: <strong className="text-[#333333]">{hIndex}</strong></span>
          </span>
          <span className="flex items-center gap-1.5">
            <Globe size={13} className="text-[#f36f21]" />
            <span>{journal.Country || "Global"}</span>
          </span>
          {journal.is_free_apc && (
            <span className="px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold">
              ◆ FREE APC
            </span>
          )}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1.5">
          {categoryList.map((cat) => (
            <span key={cat} className="px-2.5 py-1 text-[10px] font-medium rounded-lg bg-[#f9fafb] border border-[#f0f0f0] text-[#6b7280]">
              {cat}
            </span>
          ))}
        </div>

        {/* AI Reasoning */}
        <div className="flex gap-3 p-4 rounded-xl bg-[#fafafa] border border-[#f3f4f6]">
          <Sparkles size={14} className="text-[#f36f21] mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-[#f36f21] uppercase tracking-wider">AI Analysis</p>
            <p className="text-xs text-[#555555] leading-relaxed italic">"{aiReasoning}"</p>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            <a 
              href={scimagoLink} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-[#f36f21] rounded-lg text-[10px] font-bold hover:bg-orange-100 transition-all border border-orange-100 shadow-sm"
            >
              <TrendingUp size={12} /> Scimago (SJR)
            </a>
            <a 
              href={websiteSearch} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold hover:bg-blue-100 transition-all border border-blue-100 shadow-sm"
            >
              <Search size={12} /> Find Website
            </a>
            <a 
              href={scholarLink} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-[10px] font-bold hover:bg-gray-100 transition-all border border-gray-100 shadow-sm"
            >
              <GraduationCap size={12} /> Recent Papers
            </a>
          </div>

          {/* History Actions */}
          {isHistoryPage ? (
            <button 
              onClick={handleDeleteFromHistory} 
              disabled={isDeleting} 
              className="flex items-center justify-center w-8 h-8 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all" 
              title="Remove from history"
            >
              {isDeleting ? "..." : <Trash2 size={16} />}
            </button>
          ) : (
            <button 
              onClick={handleSaveToHistory} 
              disabled={isSaving || isSaved}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold transition-all shadow-sm ${
                isSaved ? 'bg-green-500 text-white' : 'bg-[#171717] text-white hover:bg-[#333333]'
              }`}
            >
              {isSaved ? <><CheckCircle2 size={14} /> Saved</> : isSaving ? "Saving..." : <><BookmarkPlus size={14} /> Bookmark</>}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}