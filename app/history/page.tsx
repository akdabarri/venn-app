"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JournalCard } from "@/components/JournalCard";
import { supabase } from "@/lib/supabase";
import { Loader2, BookmarkX, Trash2 } from "lucide-react"; // FIX: Menambahkan icon Trash2

export default function HistoryPage() {
  const { user, isLoaded } = useUser();
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
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
    }

    if (isLoaded) {
      fetchHistory();
    }
  }, [user, isLoaded]);

  // ==========================================
  // FUNGSI BARU: DELETE DATA DARI SUPABASE
  // ==========================================
  const handleDelete = async (id: string) => {
    // Memunculkan pop-up konfirmasi standar browser
    if (!confirm("Are you sure you want to remove this journal from your history?")) return;

    try {
      // 1. Perintahkan Supabase untuk menghapus data dengan ID spesifik
      const { error } = await supabase
        .from('saved_journals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // 2. Update UI: Hapus jurnal dari layar secara instan tanpa perlu refresh
      setSavedItems((prevItems) => prevItems.filter((item) => item.id !== id));
      
    } catch (error) {
      console.error("Error deleting journal:", error);
      alert("Failed to delete the journal. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-24 px-6 max-w-4xl mx-auto w-full animate-fade-up pb-24">
        <h1 className="text-3xl font-bold font-display mb-2 text-heading">Search History</h1>
        <p className="text-muted mb-8">Your previously saved journal matches and AI reasoning.</p>

        {isLoading || !isLoaded ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted">
            <Loader2 className="animate-spin text-accent w-8 h-8 mb-4" />
            <p>Loading your saved journals...</p>
          </div>
        ) : 

        savedItems.length === 0 ? (
          <div className="card-base p-12 text-center flex flex-col items-center justify-center border-dashed">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <BookmarkX className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-heading mb-1">No saved journals yet</h3>
            <p className="text-sm text-muted max-w-sm mx-auto">
              Go back to the home page, search for a journal using your abstract, and click "Save Journal" to add it here.
            </p>
          </div>
        ) : 

        (
          <div className="space-y-6">
            {savedItems.map((item, index) => (
              <div key={item.id} className="relative group">
                <JournalCard
                  rank={index + 1}
                  result={{
                    journal: item.journal_data,
                    aiReasoning: item.ai_reasoning
                  }}
                />
                
                {/* FIX: Tambahan Tombol Delete di bawah setiap kartu */}
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                    Remove from History
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}