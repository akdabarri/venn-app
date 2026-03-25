"use client";

import { useState } from "react";
import { SignInButton } from "@clerk/nextjs";

interface InputCardProps {
  onSearchSubmit: (data: { title: string; abstract: string; freeApcOnly: boolean }) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function InputCard({ onSearchSubmit, isLoading, isAuthenticated }: InputCardProps) {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [freeApcOnly, setFreeApcOnly] = useState(false);

  const handleSubmit = () => {
    if (!title || !abstract) return;
    onSearchSubmit({ title, abstract, freeApcOnly });
  };

  return (
    <div className="card-base p-6 md:p-8 animate-fade-up relative overflow-hidden">
      
      {/* Jika belum login, tampilkan Overlay Penutup (Auth Wall) */}
      {!isAuthenticated && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/95">
          <div className="text-center px-6">
            <h3 className="text-2xl font-bold mb-3 text-heading font-display">
              Unlock Full Access
            </h3>
            <p className="text-sm text-body mb-6 max-w-sm mx-auto">
              Sign in to use our AI-powered journal recommender and securely save your favorite matches to your dashboard.
            </p>
            {/* Tombol Clerk ini akan memunculkan popup */}
            <SignInButton mode="modal">
              <button className="btn-primary px-8">Sign In to Continue</button>
            </SignInButton>
          </div>
        </div>
      )}

      {/* Konten Form (Dibuat agak pudar & tidak bisa diklik jika belum login) */}
      <div className={`space-y-4 ${!isAuthenticated ? 'opacity-30 pointer-events-none select-none' : ''}`}>
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
             className="accent-accent"
           />
           <label htmlFor="apc" className="text-sm text-body">Only show Free APC journals</label>
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={isLoading || !title || !abstract || !isAuthenticated}
          className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Analyzing..." : "Find Your Journal!"}
        </button>
      </div>

    </div>
  );
}