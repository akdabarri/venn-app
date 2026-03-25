import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, 
};

export const metadata: Metadata = {
  title: "Venn — Find Your Journal | by Besbi",
  description: "AI-powered Scopus journal recommender for academic researchers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // FIX: Mematikan animasi dan efek blur bawaan Clerk agar tidak lag
    <ClerkProvider
      appearance={{
        elements: {
          modalBackdrop: "bg-black/60 backdrop-blur-none", 
          modalContent: "animate-none transition-none shadow-modal",
        }
      }}
    >
      <html lang="en" className={`${dmSans.variable} ${dmSerif.variable}`}>
        <body className="antialiased bg-white text-[#171717] selection:bg-[#f36f21]/10">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}