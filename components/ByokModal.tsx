"use client";

import { useState, useEffect, useRef } from "react";
import { X, Eye, EyeOff, Key, Shield, CheckCircle2, Trash2 } from "lucide-react";
import { useApiKey } from "@/hooks/useApiKey";

interface ByokModalProps {
  onClose: () => void;
}

const PROVIDERS = [
  { id: "openai", label: "OpenAI", prefix: "sk-", placeholder: "sk-proj-..." },
  { id: "groq", label: "Groq", prefix: "gsk_", placeholder: "gsk_..." },
  {
    id: "gemini",
    label: "Gemini",
    prefix: "AI",
    placeholder: "AIza...",
  },
];

export function ByokModal({ onClose }: ByokModalProps) {
  const { apiKey, maskedKey, hasKey, saveApiKey, clearApiKey } = useApiKey();
  const [inputValue, setInputValue] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSave = () => {
    if (!inputValue.trim()) return;
    saveApiKey(inputValue.trim());
    setInputValue("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleClear = () => {
    clearApiKey();
    setInputValue("");
  };

  // Detect provider from key prefix
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
                <h2
                  id="modal-title"
                  className="text-base font-semibold text-[#171717]"
                >
                  API Configuration
                </h2>
                <p className="text-xs text-[#9ca3af] mt-0.5">
                  Bring Your Own Key
                </p>
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
        <div className="px-6 py-5 space-y-5">
          {/* Privacy Notice */}
          <div className="flex gap-3 p-3.5 rounded-xl bg-[#fff7ef] border border-[#fde8d3]">
            <Shield size={16} className="text-[#f36f21] mt-0.5 shrink-0" />
            <p className="text-xs text-[#333333] leading-relaxed">
              Venn uses your personal AI API key (OpenAI / Groq / Gemini). It is
              stored securely in your{" "}
              <strong className="font-semibold">browser's local storage</strong>{" "}
              to protect your privacy and reduce server costs. Your key never
              touches our servers.
            </p>
          </div>

          {/* Current Key Status */}
          {hasKey && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0]">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-green-500" />
                <span className="text-xs font-medium text-green-700">
                  Active key:
                </span>
                <code className="text-xs text-green-800 font-mono bg-white/60 px-1.5 py-0.5 rounded">
                  {maskedKey}
                </code>
              </div>
              <button
                onClick={handleClear}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={12} />
                Remove
              </button>
            </div>
          )}

          {/* Provider Pills */}
          <div>
            <p className="text-xs font-medium text-[#6b7280] mb-2">
              Supported providers
            </p>
            <div className="flex gap-2">
              {PROVIDERS.map((p) => (
                <span
                  key={p.id}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
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
            <label
              htmlFor="api-key-input"
              className="text-xs font-medium text-[#333333]"
            >
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
                placeholder={
                  detectedProvider?.placeholder ?? "sk-proj-... or AIza..."
                }
                className="input-base pr-10 font-mono text-xs"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280] transition-colors"
                aria-label={showKey ? "Hide key" : "Show key"}
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
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#e5e7eb] text-sm text-[#6b7280] font-medium hover:bg-[#f9fafb] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!inputValue.trim()}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 ${
              saved
                ? "bg-green-500"
                : "bg-[#f36f21] hover:bg-[#e05e12] disabled:opacity-40 disabled:cursor-not-allowed"
            }`}
          >
            {saved ? (
              <>
                <CheckCircle2 size={15} />
                Saved!
              </>
            ) : (
              "Save Key"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
