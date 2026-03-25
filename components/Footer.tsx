"use client";

export function Footer() {
  return (
    <footer className="border-t border-[#f3f4f6] bg-white py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <span
              className="text-lg font-bold text-[#171717]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Venn
            </span>
            <span className="absolute -top-0.5 -right-1.5 w-1.5 h-1.5 rounded-full bg-[#f36f21]" />
          </div>
          <span className="text-xs text-[#9ca3af] ml-2">by Besbi</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-5 text-xs text-[#9ca3af]">
          <a href="#" className="hover:text-[#f36f21] transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-[#f36f21] transition-colors">
            Terms of Use
          </a>
          <a href="#" className="hover:text-[#f36f21] transition-colors">
            About
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-[#c4c4c4]">
          © {new Date().getFullYear()} Besbi. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
