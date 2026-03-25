"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Eye, EyeOff, Save, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Mengambil API key dari localStorage saat halaman dimuat
  useEffect(() => {
    const storedKey = localStorage.getItem("venn_api_key");
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  // Menyimpan API key ke localStorage dengan aman
  const handleSave = () => {
    localStorage.setItem("venn_api_key", apiKey.trim());
    setIsSaved(true);
    // Kembalikan tombol ke state normal setelah 3 detik
    setTimeout(() => setIsSaved(false), 3000); 
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-24 px-6 max-w-4xl mx-auto w-full animate-fade-up">
        <h1 className="text-3xl font-bold font-display mb-2 text-heading">Settings</h1>
        <p className="text-muted mb-8">Manage your AI configurations and application preferences.</p>

        <div className="card-base p-6 md:p-8">
          <h2 className="font-semibold text-xl mb-2 text-heading">AI Configuration (BYOK)</h2>
          <p className="text-sm text-muted mb-6">
            Enter your AI API Key (e.g., Google Gemini) to enable personalized abstract reasoning. 
            Your key is stored securely in your browser's local storage and is never saved to our database.
          </p>
          
          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-semibold mb-2 text-heading">API Key</label>
              <div className="relative">
                <input 
                  type={showKey ? "text" : "password"} 
                  className="input-base pr-10" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste your API key here..."
                />
                <button 
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent transition-colors"
                >
                  {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              onClick={handleSave}
              className="btn-primary"
              disabled={!apiKey}
            >
              {isSaved ? (
                <>
                  <CheckCircle2 size={18} />
                  Saved Successfully
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save API Key
                </>
              )}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}