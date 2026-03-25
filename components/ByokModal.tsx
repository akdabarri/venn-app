"use client";

import { useState, useEffect, useRef } from "react";
import { X, Eye, EyeOff, Key, Shield, CheckCircle2, Trash2, Zap, BrainCircuit } from "lucide-react";
import { useApiKey } from "@/hooks/useApiKey";

interface ByokModalProps {
  onClose: () => void;
}

const PROVIDERS = [
  { id: "openai", label: "OpenAI", prefix: "sk-", placeholder: "sk-proj-..." },
  { id: "groq", label: "Groq", prefix: "gsk_", placeholder: "gsk_..." },
  { id: "gemini", label: "Gemini", prefix: "AI", placeholder: "AIza..." },
];

export function ByokModal({ onClose }: ByokModalProps) {
  const { apiKey, maskedKey, hasKey, saveApiKey, clearApiKey } = useApiKey();
  const [inputValue, setInputValue] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Tambahan state untuk Intelligence Level
  const [modelPref, setModelPref] = useState("fast");

  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load preferensi model saat modal dibuka
  useEffect(() => {
    const storedModel = localStorage.getItem("besbi_model_pref");
    if (storedModel) setModelPref(storedModel);
    inputRef.current?.focus();
  }, []);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSave = () => {
    // Simpan Key jika ada input baru
    if (inputValue.trim()) {
      saveApiKey(inputValue.trim());
      setInputValue("");
    }
    
    // Selalu simpan preferensi model
    localStorage.setItem("besbi_model_pref", modelPref);
    
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      // Opsional: Langsung tutup modal setelah save sukses
      // onClose(); 
    }, 2000);
  };

  const handleClear = () => {
    clearApiKey();
    setInputValue("");
  };

  const detectedProvider = PROVIDERS.find((p) =>
    inputValue.startsWith(p.prefix)
  );

  return (
    <div
      ref={overlayRef}
      className="modal-overlay animate-fade-in"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-modal-in overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#f3f4f6]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#fff7ef] flex items-center justify-center">
                <Key size={18} className="text-[#f36f21]" />
              </div>
              <div>
                <h2 id="modal-title" className="text-base font-semibold text-[#171717]">
                  API Configuration
                </h2>
                <p className="text-xs text-[#9ca3af] mt-0.5">Bring Your Own Key</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#333333] transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6">
          {/* Privacy Notice */}
          <div className="flex gap-3 p-3.5 rounded-xl bg-[#fff7ef] border border-[#fde8d3]">
            <Shield size={16} className="text-[#f36f21] mt-0.5 shrink-0" />
            <p className="text-xs text-[#333333] leading-relaxed">
              Venn uses your personal API key. Stored in <strong className="font-semibold">local storage</strong> for privacy.
            </p>
          </div>

          {/* Current Key Status */}
          {hasKey && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0]">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-green-500" />
                <span className="text-xs font-medium text-green-700">Active:</span>
                <code className="text-xs text-green-800 font-mono bg-white/60 px-1.5 py-0.5 rounded">
                  {maskedKey}
                </code>
              </div>
              <button onClick={handleClear} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1">
                <Trash2 size={12} /> Remove
              </button>
            </div>
          )}

          {/* Intelligence Switcher (TAMBAHAN BARU) */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-[#6b7280]">Intelligence Level</p>
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-50 rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={() => setModelPref("fast")}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  modelPref === "fast"
                    ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Zap size={14} className={modelPref === "fast" ? "text-yellow-500" : ""} />
                Fast
              </button>
              <button
                type="button"
                onClick={() => setModelPref("smart")}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  modelPref === "smart"
                    ? "bg-white text-orange-600 shadow-sm ring-1 ring-orange-100"
                    : "text-gray-400 hover:text-orange-600"
                }`}
              >
                <BrainCircuit size={14} className={modelPref === "smart" ? "text-orange-600" : ""} />
                Smart
              </button>
            </div>
          </div>

          {/* Supported Providers */}
          <div>
            <p className="text-xs font-medium text-[#6b7280] mb-2">Supported providers</p>
            <div className="flex gap-2">
              {PROVIDERS.map((p) => (
                <span
                  key={p.id}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-colors ${
                    detectedProvider?.id === p.id
                      ? "bg-[#fff7ef] border-[#f36f21] text-[#f36f21]"
                      : "bg-[#f9fafb] border-[#e5e7eb] text-[#6b7280]"
                  }`}
                >
                  {p.label}
                </span>
              ))}
            </div>
          </div>

          {/* Key Input */}
          <div className="space-y-1.5">
            <label htmlFor="api-key-input" className="text-xs font-medium text-[#333333]">
              {hasKey ? "Update API Key" : "Enter API Key"}
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                id="api-key-input"
                type={showKey ? "text" : "password"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                placeholder={detectedProvider?.placeholder ?? "sk-proj-... or AIza..."}
                className="input-base pr-10 font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
              >
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#e5e7eb] text-sm text-[#6b7280] font-medium hover:bg-[#f9fafb]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!inputValue.trim() && !hasKey}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 ${
              saved ? "bg-green-500" : "bg-[#f36f21] hover:bg-[#e05e12]"
            }`}
          >
            {saved ? <><CheckCircle2 size={15} /> Saved!</> : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}