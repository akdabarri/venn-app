"use client";

import { X } from "lucide-react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

export const InformationModal = ({ isOpen, onClose, title, content }: InfoModalProps) => {
  if (!isOpen) return null;

  return (
    // Menghapus blur dan mempercepat animasi agar tidak terasa lag
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl border border-gray-100 flex flex-col scale-in-95 duration-150">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-heading font-display tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={18} className="text-muted" />
          </button>
        </div>
        <div className="p-6 md:p-8 overflow-y-auto text-muted leading-relaxed text-sm md:text-base prose prose-slate max-w-none scrollbar-thin">
          {content}
        </div>
        <div className="p-4 border-t border-gray-50 flex justify-end bg-gray-50/30">
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-heading text-white rounded-xl text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};