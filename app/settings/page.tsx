"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Eye, EyeOff, Save, CheckCircle2, Cpu } from "lucide-react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [apiType, setApiType] = useState("gemini"); // State untuk menyimpan tipe API
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Load data saat halaman dibuka
  useEffect(() => {
    const storedKey = localStorage.getItem("venn_api_key");
    const storedType = localStorage.getItem("venn_api_type");
    
    if (storedKey) setApiKey(storedKey);
    if (storedType) setApiType(storedType);
  }, []);

  // Fungsi Simpan yang krusial
  const handleSave = () => {
    localStorage.setItem("venn_api_key", apiKey.trim());
    localStorage.setItem("venn_api_type", apiType); // Ini yang membuat rute backend tahu harus pakai OpenAI
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000); 
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-24 px-6 max-w-4xl mx-auto w-full animate-fade-up">
        <h1 className="text-3xl font-bold font-display mb-2 text-heading tracking-tight">Settings</h1>
        <p className="text-muted mb-8 text-sm md:text-base">Manage your AI configurations and application preferences.</p>

        <div className="card-base p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-orange-50 rounded-lg text-[#f36f21]">
                <Cpu size={24} />
             </div>
             <h2 className="font-bold text-xl text-heading">AI Configuration (BYOK)</h2>
          </div>
          
          <p className="text-sm text-muted mb-8 leading-relaxed">
            Choose your preferred AI provider and enter your API Key. 
            Venn will use this configuration to analyze your abstracts.
          </p>
          
          <div className="space-y-6 max-w-xl">
            {/* DROP DOWN PROVIDER */}
            <div>
              <label className="block text-sm font-bold mb-2 text-heading tracking-tight">Supported API</label>
              <select 
                value={apiType}
                onChange={(e) => setApiType(e.target.value)}
                className="input-base bg-white cursor-pointer border-gray-200 focus:border-[#f36f21] outline-none"
              >
                <option value="gemini">Google Gemini (Recommended)</option>
                <option value="openai">OpenAI (GPT-4o mini)</option>
                <option value="deepseek">DeepSeek AI</option>
              </select>
            </div>

            {/* INPUT API KEY */}
            <div>
              <label className="block text-sm font-bold mb-2 text-heading tracking-tight">API Key</label>
              <div className="relative">
                <input 
                  type={showKey ? "text" : "password"} 
                  className="input-base pr-12 font-mono text-sm" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`Paste your ${apiType} key here...`}
                />
                <button 
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#f36f21] transition-colors"
                >
                  {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              onClick={handleSave}
              className={`btn-primary flex items-center justify-center gap-2 w-full sm:w-auto min-w-[180px] transition-all shadow-sm ${
                isSaved ? "bg-green-600 hover:bg-green-700 shadow-green-100" : "bg-heading"
              }`}
              disabled={!apiKey}
            >
              {isSaved ? (
                <>
                  <CheckCircle2 size={18} />
                  Settings Saved
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
           <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
             <strong>Privacy Note:</strong> Your keys are stored only in your local browser storage. Besbi never uploads your keys or research abstracts to our database.
           </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}