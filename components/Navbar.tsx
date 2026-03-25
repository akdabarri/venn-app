"use client";

import { useState } from "react";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import { Settings, History, BookOpen } from "lucide-react";
import { ByokModal } from "./ByokModal";

export function Navbar() {
  const { isSignedIn } = useUser();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#f0f0f0]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* ── Logo ── */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <span
                className="text-2xl font-bold tracking-tight text-[#171717]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Venn
              </span>
              {/* Scopus Orange dot */}
              <span
                className="absolute -top-0.5 -right-2 w-2 h-2 rounded-full bg-[#f36f21] group-hover:scale-125 transition-transform duration-200"
                aria-hidden="true"
              />
            </div>
            <span className="text-xs text-[#9ca3af] font-medium mt-0.5 ml-2 tracking-wide">
              by Besbi
            </span>
          </a>

          {/* ── Right Actions ── */}
          <nav className="flex items-center gap-1">
            {isSignedIn && (
              <>
                {/* History */}
                <a
                  href="/history"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[#6b7280] text-sm font-medium hover:bg-[#fff7ef] hover:text-[#f36f21] transition-all duration-150"
                >
                  <History size={15} strokeWidth={2} />
                  <span className="hidden sm:inline">History</span>
                </a>

                {/* Settings → BYOK Modal */}
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[#6b7280] text-sm font-medium hover:bg-[#fff7ef] hover:text-[#f36f21] transition-all duration-150"
                  aria-label="API Settings"
                >
                  <Settings size={15} strokeWidth={2} />
                  <span className="hidden sm:inline">Settings</span>
                </button>
              </>
            )}

            {/* Divider */}
            <div className="w-px h-5 bg-[#e5e7eb] mx-1" />

            {/* Auth */}
            {isSignedIn ? (
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            ) : (
              <SignInButton mode="modal">
                <button className="btn-primary text-sm px-4 py-2">
                  Sign In
                </button>
              </SignInButton>
            )}
          </nav>
        </div>
      </header>

      {/* BYOK Modal */}
      {isSettingsOpen && (
        <ByokModal onClose={() => setIsSettingsOpen(false)} />
      )}
    </>
  );
}
