"use client";

import { useState, useEffect } from "react";
import { SignInButton } from "@clerk/nextjs";

interface InputCardProps {
  onSearchSubmit: (data: { title: string; abstract: string; freeApcOnly: boolean }) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  initialData?: { title: string; abstract: string; freeApcOnly: boolean } | null; // Tambahkan prop ini
}

export function InputCard({ onSearchSubmit, isLoading, isAuthenticated, initialData }: InputCardProps) {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [freeApcOnly, setFreeApcOnly] = useState(false);

  // ==========================================================
  // EFFECT: AUTO-FILL DARI CACHE (Mencegah Teks Hilang)
  // ==========================================================
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setAbstract(initialData.abstract || "");
      setFreeApcOnly(initialData.freeApcOnly || false);
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!title || !abstract) return;
    onSearchSubmit({ title, abstract, freeApcOnly });
  };

  return (
    <div className="card-base p-6 md:p-8 animate-fade-up relative overflow-hidden">
      
      {/* Auth Wall Overlay */}
      {!isAuthenticated && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm">
          <div className="text-center px-6">
            <h3 className="text-2xl font-bold mb-3 text-heading font-display">
              Unlock Full Access
            </h3>
            <p className="text-sm text-body mb-6 max-w-sm mx-auto leading-relaxed">
              Sign in to use our AI-powered journal recommender and securely save your favorite matches to your dashboard.
            </p>
            <SignInButton mode="modal">
              <button className="btn-primary px-8 shadow-lg shadow-accent/20">Sign In to Continue</button>
            </SignInButton>
          </div>
        </div>
      )}

      {/* Konten Form */}
      <div className={`space-y-4 transition-opacity duration-300 ${!isAuthenticated ? 'opacity-30 pointer-events-none select-none' : ''}`}>
        <div>
          <label className="block text-sm font-semibold mb-2 text-heading">Paper Title</label>
          <input 
            type="text" 
            className="input-base" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Enter your paper title..."
            disabled={isLoading || !isAuthenticated}
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-2 text-heading">Abstract</label>
          <textarea 
            className="input-base min-h-[150px] resize-y" 
            value={abstract} 
            onChange={(e) => setAbstract(e.target.value)} 
            placeholder="Paste your abstract here..."
            disabled={isLoading || !isAuthenticated}
          />
        </div>

        <div className="flex items-center gap-2 mt-4">
           <input 
             type="checkbox" 
             id="apc"
             checked={freeApcOnly}
             onChange={(e) => setFreeApcOnly(e.target.checked)}
             disabled={isLoading || !isAuthenticated}
             className="accent-accent w-4 h-4 cursor-pointer"
           />
           <label htmlFor="apc" className="text-sm text-body cursor-pointer select-none font-medium">
             Only show Free APC journals
           </label>
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={isLoading || !title || !abstract || !isAuthenticated}
          className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] transition-all"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing Abstract...
            </span>
          ) : (
            "Find Your Journal!"
          )}
        </button>
      </div>
    </div>
  );
}