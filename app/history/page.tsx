"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JournalCard } from "@/components/JournalCard";
import { supabase } from "@/lib/supabase";
import { Loader2, BookmarkX, ArrowLeft } from "lucide-react";

export default function HistoryPage() {
  const { user, isLoaded } = useUser();
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk mengambil data history dari Supabase
  const fetchHistory = async () => {
    if (!user) return; 
    
    try {
      const { data, error } = await supabase
        .from('saved_journals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedItems(data || []);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger fetch saat user sudah ter-load dari Clerk
  useEffect(() => {
    if (isLoaded && user) {
      fetchHistory();
    }
  }, [user, isLoaded]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 pt-24 px-6 max-w-4xl mx-auto w-full animate-fade-up pb-24">
        {/* Navigation Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-[#f36f21] mb-6 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Search
        </Link>

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display mb-2 text-heading tracking-tight">Search History</h1>
          <p className="text-muted text-sm md:text-base">
            Your previously saved journal matches and AI-generated reasoning.
          </p>
        </div>

        {/* Loading State */}
        {(isLoading || !isLoaded) ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted">
            <Loader2 className="animate-spin text-[#f36f21] w-10 h-10 mb-4 opacity-80" />
            <p className="font-medium animate-pulse">Retrieving your collection...</p>
          </div>
        ) : 

        /* Empty State */
        savedItems.length === 0 ? (
          <div className="card-base p-16 text-center flex flex-col items-center justify-center border-dashed border-2 bg-[#fafafa]/50">
            <div className="w-20 h-20 bg-white shadow-sm rounded-3xl flex items-center justify-center mb-6 border border-gray-100">
              <BookmarkX className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-heading mb-2">No saved journals yet</h3>
            <p className="text-sm text-muted max-w-xs mx-auto leading-relaxed">
              Explore recommendations on the home page and save your favorite journals to see them here.
            </p>
          </div>
        ) : 

        /* List State */
        (
          <div className="grid gap-6">
            {savedItems.map((item, index) => (
              <JournalCard
                key={item.id}
                rank={index + 1}
                isHistoryPage={true} // Kunci untuk mengaktifkan tombol "Remove"
                onDelete={fetchHistory} // Otomatis refresh list setelah hapus berhasil
                result={{
                  journal: item.journal_data,
                  aiReasoning: item.ai_reasoning
                }}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}