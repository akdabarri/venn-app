"use client";

import { useState } from "react";
import { InformationModal } from "./InformationModal";

export const Footer = () => {
  const [modalType, setModalType] = useState<string | null>(null);

  const infoContent: Record<string, { title: string; content: React.ReactNode }> = {
    tutorial: {
      title: "Setup & Configuration Guide",
      content: (
        <div className="space-y-4">
          <p className="font-medium text-heading italic underline text-sm md:text-base">Venn is a "Bring Your Own Key" (BYOK) application to ensure maximum privacy for researchers.</p>
          
          <div className="grid gap-3 mt-4">
            <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-xl">
              <p className="text-sm font-bold mb-1 text-[#f36f21]">Option 1: Google Gemini (Recommended)</p>
              <p className="text-xs text-muted leading-relaxed">
                Get a free API Key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Google AI Studio</a>.
              </p>
            </div>
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
              <p className="text-sm font-bold mb-1 text-blue-600">Option 2: Other Supported APIs</p>
              <p className="text-xs text-muted leading-relaxed">
                Use your own <strong>DeepSeek</strong> or <strong>OpenAI</strong> keys from their respective developer dashboards.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-sm font-bold text-heading">How to activate:</p>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-muted">
              <li>Copy your API Key from your provider.</li>
              <li>Go to <strong>Settings</strong> in the navigation bar.</li>
              <li>Select your provider and paste your key.</li>
            </ol>
          </div>
          <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-[11px] text-muted">
            <strong>Privacy Note:</strong> Keys are stored locally in your browser and are never sent to our database.
          </div>
        </div>
      )
    },
    privacy: {
      title: "Privacy Policy",
      content: (
        <div className="space-y-4 text-sm">
          <p>Your research data is handled with integrity:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>No Harvesting:</strong> Abstracts are processed in real-time and not stored for training.</li>
            <li><strong>Local Storage:</strong> API keys stay on your device.</li>
            <li><strong>Authentication:</strong> Powered by Clerk for secure identity management.</li>
          </ul>
        </div>
      )
    },
    terms: {
      title: "Terms of Use",
      content: (
        <div className="space-y-4 text-sm">
          <p>By using Besbi, you agree that:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>AI Tool:</strong> This is an assistant; verify results on official publisher sites.</li>
            <li><strong>Responsibility:</strong> You are responsible for your own API key usage.</li>
            <li><strong>Purpose:</strong> This tool supports, not replaces, formal academic review.</li>
          </ul>
        </div>
      )
    },
    about: {
      title: "About Besbi",
      content: (
        <div className="space-y-4 text-sm">
          <p><strong>Besbi</strong> is an AI-driven academic tool designed to help researchers identify the most relevant Scopus-indexed journals for their work.</p>
          <p>Developed as a research project in <strong>Computer Science Education (CSEDU)</strong>, Besbi leverages semantic intelligence to bridge the gap between researchers and impactful publication venues.</p>
          <div className="pt-6 border-t border-gray-100 text-[10px] text-muted uppercase tracking-widest">
             Created by AkdaBarri • Universitas Pendidikan Indonesia
          </div>
        </div>
      )
    }
  };

  return (
    <footer className="w-full py-10 border-t border-gray-100 mt-20 bg-gray-50/20">
      {/* flex-col-reverse memastikan Navigasi di atas dan Copyright di bawah saat mobile */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col-reverse md:flex-row justify-between items-center gap-8">
        
        {/* Copyright Section (Bawah di Mobile, Kiri di Desktop) */}
        <div className="text-center md:text-left">
          <p className="text-xs text-muted font-medium">© 2026 Besbi. All rights reserved.</p>
        </div>
        
        {/* Navigation Links (Atas di Mobile, Kanan di Desktop) */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
          <button 
            onClick={() => setModalType('tutorial')} 
            className="text-xs font-bold text-[#f36f21] hover:opacity-80 transition-all uppercase tracking-wider"
          >
            How to Start?
          </button>
          <button onClick={() => setModalType('privacy')} className="text-xs text-muted hover:text-heading transition-colors">Privacy</button>
          <button onClick={() => setModalType('terms')} className="text-xs text-muted hover:text-heading transition-colors">Terms</button>
          <button onClick={() => setModalType('about')} className="text-xs text-muted hover:text-heading transition-colors">About</button>
        </div>
      </div>

      <InformationModal 
        isOpen={!!modalType} 
        onClose={() => setModalType(null)}
        title={modalType ? infoContent[modalType].title : ""}
        content={modalType ? infoContent[modalType].content : null}
      />
    </footer>
  );
};